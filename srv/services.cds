using { sap.capire.incidents as my } from '../db/schema';
using { northwind as nw } from './external/Northwind';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */



service ProcessorService { 
    @cds.redirection.target
    entity Incidents as projection on my.Incidents ;

    @readonly
    entity Customers as projection on my.Customers;

    entity Comments as projection on my.Comments;
    @readonly
    entity ListOfIncidents as projection on my.ListOfIncidents;
    @odata.draft.enabled
    entity Items as projection on my.Items;

    @readonly
    entity Orders as projection on nw.Orders;

    function getOrdersBTP() returns many String;

    function getItemsByQuantity(quantity: Integer) returns array of Items;
    action createItem(title: String, description: String, quantity: Integer) returns Items;
    // function getOrdersBTP() returns many Orders;
    
}
annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: 'support');


/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService {
    entity Customers as projection on my.Customers;
    entity Incidents as projection on my.Incidents;
    entity Comments as projection on my.Comments;
}

annotate AdminService with @(requires: 'admin');