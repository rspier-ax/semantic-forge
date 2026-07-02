import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import type UIComponent from 'sap/ui/core/UIComponent';
import type ODataModel from 'sap/ui/model/odata/v4/ODataModel';
import type { Table$SelectionChangeEvent } from 'sap/m/Table';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';

interface ModelRow {
  ID: string;
  name: string;
}

/**
 * @namespace semantic.forge.ui5.controller
 */
export default class ModelList extends Controller {
  onInit(): void {
    this.setModel(new JSONModel({ error: '' }), 'view');

    const odataModel = this.getOwnerComponent()?.getModel() as ODataModel | undefined;
    odataModel?.attachMetadataFailed(() => {
      this._setError(this._i18n().getText('loadModelsError'));
    });
  }

  onSelectionChange(event: Table$SelectionChangeEvent): void {
    const item = event.getParameter('listItem');
    const context = item?.getBindingContext();
    const model = context?.getObject() as ModelRow | undefined;
    if (!model?.ID) {
      return;
    }
    const router = (this.getOwnerComponent() as UIComponent).getRouter();
    router.navTo('modelEditor', { modelId: model.ID });
  }

  onRetryPress(): void {
    const odataModel = this.getOwnerComponent()?.getModel() as ODataModel | undefined;
    odataModel?.refresh(true);
    this.getView()?.getModel('view')?.setProperty('/error', '');
  }

  private _setError(message: string): void {
    this.getView()?.getModel('view')?.setProperty('/error', message);
  }

  private _i18n(): ResourceBundle {
    return this.getView()?.getModel('i18n')?.getResourceBundle() as ResourceBundle;
  }
}
