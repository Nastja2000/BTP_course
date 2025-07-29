const cds = require('@sap/cds')

class NorthwindService extends cds.ApplicationService {
  /** Registering custom event handlers */
  async init() {
    
    this.northwind = await cds.connect.to('northwind_local');

    this.on('getOrders', (req) => this.onGetOrders(req));

    return super.init();
  }

  async onGetOrders(req) {
    try {
      const result = await this.northwind.get('/Orders');
      return result;
    } catch (error) {
      console.error('Error in getting Orders:', error);
      req.error(500, 'Error during Northwind call');
    }
  }  
}
module.exports = { NorthwindService }
