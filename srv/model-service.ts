import cds from '@sap/cds';
import { registerModelServiceHandlers } from './handlers/model-service.js';

const registered = new WeakSet<cds.ApplicationService>();

function ensureHandlers(srv: cds.ApplicationService): void {
  if (registered.has(srv)) {
    return;
  }
  registered.add(srv);
  registerModelServiceHandlers(srv);
}

cds.on('serving', (srv) => {
  if (srv.name === 'ModelService') {
    ensureHandlers(srv);
  }
});

export default class ModelService extends cds.ApplicationService {
  async init() {
    ensureHandlers(this);
    return super.init();
  }
}
