using { northwind as nw } from './external/Northwind';

service NorthwindService {
  entity Orders as projection on nw.Orders;
  function getOrders() returns array of Orders;
  function getOrdersBTP() returns array of Orders;
}
