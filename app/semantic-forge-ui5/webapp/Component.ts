import UIComponent from 'sap/ui/core/UIComponent';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace semantic.forge.ui5
 */
export default class Component extends UIComponent {
  static metadata = {
    manifest: 'json',
  };

  init(): void {
    super.init();
    this.setModel(new JSONModel({ busy: false }), 'ui');
    this.getRouter().initialize();
  }
}
