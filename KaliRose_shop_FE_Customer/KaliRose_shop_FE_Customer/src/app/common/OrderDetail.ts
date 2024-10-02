import { Order } from "./Order";
import { Product } from "./Product";

export class OrderDetail {
    'orderDetailId':number;
    'quantity':number;
    'price':number;
    'product':Product;
    'order':Order;
    'size':string;
    constructor(id: number) {
        this.orderDetailId = id;
    }
}
