import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import type UIComponent from 'sap/ui/core/UIComponent';
import type ODataModel from 'sap/ui/model/odata/v4/ODataModel';
import type ResourceModel from 'sap/ui/model/resource/ResourceModel';
import type { Input$ChangeEvent } from 'sap/m/Input';
import type { Route$PatternMatchedEvent } from 'sap/ui/core/routing/Route';
import EditorService from '../service/EditorService';

const emptyDraft = {
  metadata: { name: '' },
  entities: [],
  dimensions: [],
  measures: [],
  calculatedMeasures: [],
  relationships: [],
  hierarchies: [],
};

/**
 * @namespace semantic.forge.ui5.controller
 */
export default class ModelEditor extends Controller {
  private editorService?: EditorService;

  onInit(): void {
    this.setModel(
      new JSONModel({
        modelId: '',
        revision: 0,
        draft: structuredClone(emptyDraft),
        originalDraft: structuredClone(emptyDraft),
        dirty: false,
        loading: false,
        saving: false,
      }),
      'editor',
    );

    const router = (this.getOwnerComponent() as UIComponent).getRouter();
    router.getRoute('modelEditor')?.attachPatternMatched(this.onRouteMatched, this);
  }

  private getEditorService(): EditorService {
    if (!this.editorService) {
      const odataModel = this.getOwnerComponent()?.getModel() as ODataModel;
      const editorModel = this.getView()?.getModel('editor') as JSONModel;
      const i18n = (this.getView()?.getModel('i18n') as ResourceModel).getResourceBundle();
      this.editorService = new EditorService(odataModel, editorModel, i18n);
    }
    return this.editorService;
  }

  private async onRouteMatched(event: Route$PatternMatchedEvent): Promise<void> {
    const modelId = event.getParameter('arguments')?.modelId as string;
    await this.getEditorService().loadModel(modelId);
  }

  onNavBack(): void {
    const router = (this.getOwnerComponent() as UIComponent).getRouter();
    router.navTo('models', {}, undefined, true);
  }

  onNameChange(event: Input$ChangeEvent): void {
    const value = event.getParameter('value') ?? '';
    this.getEditorService().onNameChange(value);
  }

  async onSavePress(): Promise<void> {
    await this.getEditorService().saveDraft();
  }

  async onReloadPress(): Promise<void> {
    await this.getEditorService().reloadFromServer();
  }
}
