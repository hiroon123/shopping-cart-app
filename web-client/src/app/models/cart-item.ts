import { Product } from "./product";

export class CartItem {
  id: number;
  product_id: number;
  qty: number;

  constructor(id: 0, product_id = 0, qty: 1) {
    this.id = id;
    this.product_id = product_id;
    this.qty = qty;
  }
}
