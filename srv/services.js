const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
    this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));
    this.before("READ", "Incidents", async () => {
      const { Customers } = this.entities;
      const customers = await SELECT.from(Customers);

      console.log(customers);
    });

    return super.init();
  }
  

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data];
      incidents.forEach((incident) => {
        if (incident.title?.toLowerCase().includes("urgent")) {
          incident.urgency = { code: "H", descr: "High" };
        }
      });
    }
  }

  /** Custom Validation */
  async onUpdate (req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ID: req.data.ID})
    if (status_code === 'C')
      return req.reject(`Can't modify a closed incident`)
  }

  async getItemsByQuantity (quantity) {
    const { Items } = this.entities;
    return await SELECT.from(Items).where({ quantity });
  }

  async createItem (title, description, quantity) {
    const { Items } = this.entities;
    
    try {
        if (quantity > 100) {
          throw cds.error(400, "Quantity cannot be more than 100");
        }
        const newItem = await cds.run(
          INSERT.into(Items).entries({
            title,
            description,
            quantity
          })
        );
        
        return newItem;
    } catch (error) {
      throw cds.error(400, error.message);
    }
  }
}
module.exports = { ProcessorService }
