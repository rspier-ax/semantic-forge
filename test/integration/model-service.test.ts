import cds from '@sap/cds';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import '../../srv/model-service.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../..');

const SALES_ID = '11111111-1111-4111-8111-111111111111';
const INCOMPLETE_ID = '22222222-2222-4222-8222-222222222222';

describe('ModelService integration', () => {
  const { GET, POST, PATCH } = cds.test(projectRoot);

  it('lists seeded semantic models', async () => {
    const { status, data } = await GET('/odata/v4/model/Models');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.value));
    assert.ok(data.value.length >= 2);
  });

  it('increments revision on save and rejects stale revision', async () => {
    const read = await GET(`/odata/v4/model/Models(${SALES_ID})`);
    assert.equal(read.status, 200);
    const revision = read.data.revision as number;

    const save = await PATCH(`/odata/v4/model/Models(${SALES_ID})`, {
      revision,
      name: 'Sales Analytics Updated',
    });
    assert.equal(save.status, 200);

    try {
      await PATCH(`/odata/v4/model/Models(${SALES_ID})`, {
        revision,
        name: 'Stale Save Attempt',
      });
      assert.fail('Expected stale save to return 409');
    } catch (error) {
      const err = error as { status?: number };
      assert.equal(err.status, 409);
    }
  });

  it('returns MODEL-001 for incomplete draft on validateModel', async () => {
    const read = await GET(`/odata/v4/model/Models(${INCOMPLETE_ID})`);
    const revision = read.data.revision as number;

    const result = await POST('/odata/v4/model/validateModel', {
      modelId: INCOMPLETE_ID,
      revision,
    });
    assert.equal(result.status, 200);
    assert.ok(
      result.data.issues.some((issue: { ruleId: string }) => issue.ruleId === 'MODEL-001'),
    );
  });

  it('blocks publish when validation errors exist', async () => {
    const read = await GET(`/odata/v4/model/Models(${INCOMPLETE_ID})`);
    const revision = read.data.revision as number;

    try {
      await POST('/odata/v4/model/publishModel', {
        modelId: INCOMPLETE_ID,
        revision,
        comment: 'Should fail',
      });
      assert.fail('Expected publish to return 422');
    } catch (error) {
      const err = error as { status?: number };
      assert.equal(err.status, 422);
    }
  });

  it('publishes valid model and creates version row', async () => {
    const read = await GET(`/odata/v4/model/Models(${SALES_ID})`);
    const revision = read.data.revision as number;

    const result = await POST('/odata/v4/model/publishModel', {
      modelId: SALES_ID,
      revision,
      comment: 'Phase 1 publish',
    });
    assert.equal(result.status, 200);
    assert.ok(result.data.versionNumber >= 2);

    const versions = await GET('/odata/v4/model/ModelVersions');
    assert.equal(versions.status, 200);
    const forModel = versions.data.value.filter(
      (row: { model_ID: string }) => row.model_ID === SALES_ID,
    );
    assert.ok(forModel.length >= 1);
  });
});
