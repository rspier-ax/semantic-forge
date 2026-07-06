import JSONModel from 'sap/ui/model/json/JSONModel';
import type ODataModel from 'sap/ui/model/odata/v4/ODataModel';
import MessageBox from 'sap/m/MessageBox';
import type ResourceBundle from 'sap/base/i18n/ResourceBundle';

interface SemanticModelSnapshot {
  entities: Array<{ id: string; name: string; role: string }>;
  dimensions: unknown[];
  measures: unknown[];
  calculatedMeasures: unknown[];
  relationships: unknown[];
  hierarchies: unknown[];
  metadata: { name: string; description?: string };
}

interface EditorState {
  modelId: string;
  revision: number;
  draft: SemanticModelSnapshot;
  originalDraft: SemanticModelSnapshot;
  dirty: boolean;
  loading: boolean;
  saving: boolean;
}

const emptySnapshot = (name = ''): SemanticModelSnapshot => ({
  entities: [],
  dimensions: [],
  measures: [],
  calculatedMeasures: [],
  relationships: [],
  hierarchies: [],
  metadata: { name },
});

function parseSnapshot(raw: string | undefined, fallbackName: string): SemanticModelSnapshot {
  if (!raw) {
    return emptySnapshot(fallbackName);
  }
  return JSON.parse(raw) as SemanticModelSnapshot;
}

/**
 * Coordinates editor state and OData draft save.
 * @namespace semantic.forge.ui5.service
 */
export default class EditorService {
  private readonly odataModel: ODataModel;
  private readonly editorModel: JSONModel;
  private readonly i18n: ResourceBundle;

  constructor(odataModel: ODataModel, editorModel: JSONModel, i18n: ResourceBundle) {
    this.odataModel = odataModel;
    this.editorModel = editorModel;
    this.i18n = i18n;
  }

  async loadModel(modelId: string): Promise<void> {
    this.editorModel.setProperty('/loading', true);
    try {
      const binding = this.odataModel.bindContext(`/Models(${modelId})`);
      await binding.requestObject();
      const data = binding.getBoundContext()?.getObject() as {
        ID: string;
        name: string;
        revision: number;
        draftContent?: string;
      };

      if (!data) {
        throw new Error('Model not found');
      }

      const draft = parseSnapshot(data.draftContent, data.name);
      draft.metadata.name = data.name;

      const state: EditorState = {
        modelId: data.ID,
        revision: data.revision,
        draft,
        originalDraft: structuredClone(draft),
        dirty: false,
        loading: false,
        saving: false,
      };
      this.editorModel.setData(state);
    } finally {
      this.editorModel.setProperty('/loading', false);
    }
  }

  onNameChange(name: string): void {
    this.editorModel.setProperty('/draft/metadata/name', name);
    const originalName = this.editorModel.getProperty('/originalDraft/metadata/name') as string;
    this.editorModel.setProperty('/dirty', name !== originalName);
  }

  async saveDraft(): Promise<void> {
    const state = this.editorModel.getData() as EditorState;
    this.editorModel.setProperty('/saving', true);
    try {
      const binding = this.odataModel.bindContext(`/Models(${state.modelId})`, undefined, {
        $$updateGroupId: '$direct',
      });
      const context = binding.getBoundContext();
      context?.setProperty('revision', state.revision);
      context?.setProperty('name', state.draft.metadata.name);
      context?.setProperty('draftContent', JSON.stringify(state.draft));
      await binding.execute('$direct');

      const updated = binding.getBoundContext()?.getObject() as { revision?: number };
      const nextRevision = updated?.revision ?? state.revision + 1;
      this.editorModel.setProperty('/revision', nextRevision);
      this.editorModel.setProperty('/originalDraft', structuredClone(state.draft));
      this.editorModel.setProperty('/dirty', false);
      MessageBox.success(this.i18n.getText('saveSuccess'));
    } catch (error: unknown) {
      if (isHttpError(error, 409)) {
        MessageBox.error(this.i18n.getText('staleRevisionMessage'));
      } else {
        MessageBox.error(this.i18n.getText('saveError'));
      }
      throw error;
    } finally {
      this.editorModel.setProperty('/saving', false);
    }
  }

  reloadFromServer(): Promise<void> {
    const modelId = this.editorModel.getProperty('/modelId') as string;
    return this.loadModel(modelId);
  }
}

function isHttpError(error: unknown, status: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === status
  );
}
