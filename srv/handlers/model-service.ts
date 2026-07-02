import cds from '@sap/cds';
import { createHash, randomUUID } from 'node:crypto';
import {
  PublicationBlockedError,
  StaleRevisionError,
  canPublish,
  saveDraft,
} from '@semantic-forge/domain';
import { createRunId, runValidation } from '@semantic-forge/validation-engine';
import type { SemanticModelSnapshot } from '@semantic-forge/contracts';

type ModelServiceInstance = cds.ApplicationService;

const MODELS = 'semanticforge.SemanticModels';
const VERSIONS = 'semanticforge.ModelVersions';
const RUNS = 'semanticforge.ValidationRuns';
const AUDIT = 'semanticforge.AuditEvents';

function parseSnapshot(raw: string | null | undefined): SemanticModelSnapshot {
  if (!raw) {
    return {
      entities: [],
      dimensions: [],
      measures: [],
      calculatedMeasures: [],
      relationships: [],
      hierarchies: [],
      metadata: { name: '' },
    };
  }
  return JSON.parse(raw) as SemanticModelSnapshot;
}

function stringifySnapshot(snapshot: SemanticModelSnapshot): string {
  return JSON.stringify(snapshot);
}

async function appendAudit(
  modelId: string,
  eventType: string,
  actor: string,
  details: string,
): Promise<void> {
  await INSERT.into(AUDIT).entries({
    ID: randomUUID(),
    model_ID: modelId,
    eventType,
    actor,
    details,
  });
}

export function registerModelServiceHandlers(srv: ModelServiceInstance): void {
  srv.before('UPDATE', 'Models', async (req) => {
    const id = (req.data.ID ?? req.params?.[0]) as string | undefined;
    if (!id) {
      return req.reject(400, 'Model ID is required');
    }

    const expectedRevision = req.data.revision as number | undefined;
    if (expectedRevision === undefined) {
      return req.reject(400, 'revision is required for optimistic concurrency');
    }

    const existing = await SELECT.one.from(MODELS).where({ ID: id });
    if (!existing) {
      return req.reject(404, 'Model not found');
    }

    try {
      const currentContent = parseSnapshot(existing.draftContent as string);
      const nextContent = req.data.draftContent
        ? parseSnapshot(req.data.draftContent as string)
        : {
            ...currentContent,
            metadata: {
              ...currentContent.metadata,
              name: (req.data.name as string) ?? currentContent.metadata.name,
            },
          };

      const saved = saveDraft(
        { revision: existing.revision as number, content: currentContent },
        expectedRevision,
        nextContent,
      );

      req.data.revision = saved.revision;
      req.data.draftContent = stringifySnapshot(saved.content);
      req.data.name = saved.content.metadata.name ?? existing.name;
      req.data.modifiedAt = new Date().toISOString();
      req.data.modifiedBy = req.user?.id ?? 'anonymous';
    } catch (error) {
      if (error instanceof StaleRevisionError) {
        return req.reject(409, error.message);
      }
      throw error;
    }
  });

  srv.after('UPDATE', 'Models', async (data, req) => {
    const id = (req.data.ID ?? data?.ID) as string | undefined;
    if (!id) {
      return;
    }
    await appendAudit(
      id,
      'DRAFT_UPDATED',
      req.user?.id ?? 'anonymous',
      `revision=${data?.revision ?? req.data.revision}`,
    );
  });

  srv.on('validateModel', async (req) => {
    const { modelId, revision } = req.data as {
      modelId: string;
      revision: number;
    };

    const model = await SELECT.one.from(MODELS).where({ ID: modelId });
    if (!model) {
      return req.reject(404, 'Model not found');
    }
    if (model.revision !== revision) {
      return req.reject(409, 'Stale revision');
    }

    const snapshot = parseSnapshot(model.draftContent as string);
    const { issues, rulesExecuted } = runValidation(snapshot);
    const runId = createRunId();

    await INSERT.into(RUNS).entries({
      ID: runId,
      model_ID: modelId,
      revision,
      rulesExecuted,
      issues: issues.map((issue) => ({
        ID: issue.id,
        ruleId: issue.ruleId,
        category: issue.category,
        severity: issue.severity,
        message: issue.message,
        risk: issue.risk,
        suggestedFix: issue.suggestedFix,
        location: issue.location,
        breaking: issue.breaking,
      })),
    });

    await appendAudit(
      modelId,
      'VALIDATION_EXECUTED',
      req.user?.id ?? 'anonymous',
      `runId=${runId};issues=${issues.length}`,
    );

    return { runId, issues };
  });

  srv.on('publishModel', async (req) => {
    const { modelId, revision, comment } = req.data as {
      modelId: string;
      revision: number;
      comment: string;
    };

    const model = await SELECT.one.from(MODELS).where({ ID: modelId });
    if (!model) {
      return req.reject(404, 'Model not found');
    }
    if (model.revision !== revision) {
      return req.reject(409, 'Stale revision');
    }

    const snapshot = parseSnapshot(model.draftContent as string);
    const { issues } = runValidation(snapshot);

    try {
      canPublish(model.revision as number, revision, issues);
    } catch (error) {
      if (error instanceof PublicationBlockedError) {
        return req.reject(422, 'Publication blocked due to validation errors');
      }
      if (error instanceof StaleRevisionError) {
        return req.reject(409, error.message);
      }
      throw error;
    }

    const lastVersion = await SELECT.one
      .from(VERSIONS)
      .where({ model_ID: modelId })
      .orderBy({ versionNumber: 'desc' });

    const versionNumber = ((lastVersion?.versionNumber as number | undefined) ?? 0) + 1;
    const snapshotJson = stringifySnapshot(snapshot);
    const checksum = createHash('sha256').update(snapshotJson).digest('hex');

    await INSERT.into(VERSIONS).entries({
      ID: randomUUID(),
      model_ID: modelId,
      versionNumber,
      snapshot: snapshotJson,
      checksum,
      publicationComment: comment ?? '',
      publishedBy: req.user?.id ?? 'anonymous',
      publishedAt: new Date().toISOString(),
    });

    await UPDATE(MODELS)
      .set({
        status: 'published',
        publishedVersionNumber: versionNumber,
        modifiedAt: new Date().toISOString(),
        modifiedBy: req.user?.id ?? 'anonymous',
      })
      .where({ ID: modelId });

    await appendAudit(
      modelId,
      'MODEL_PUBLISHED',
      req.user?.id ?? 'anonymous',
      `version=${versionNumber}`,
    );

    return { versionNumber, checksum };
  });
}
