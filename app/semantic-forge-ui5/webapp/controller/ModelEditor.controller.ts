import Controller from 'sap/ui/core/mvc/Controller';
import type UIComponent from 'sap/ui/core/UIComponent';
import type { Route$PatternMatchedEvent } from 'sap/ui/core/routing/Route';

/**
 * Placeholder editor route — full editor lands in PR5.
 * @namespace semantic.forge.ui5.controller
 */
export default class ModelEditor extends Controller {
  onNavBack(): void {
    const router = (this.getOwnerComponent() as UIComponent).getRouter();
    router.navTo('models', {}, undefined, true);
  }

  onRouteMatched(_event: Route$PatternMatchedEvent): void {
    // Reserved for PR5 — modelId available via event.getParameter('arguments')
  }
}
