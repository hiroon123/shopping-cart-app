import { Product } from "./product";

export class CartItem {
  id: number;
  product_id: number;
  user_id: number;
  qty!: number;

  constructor(id: 0, product_id = 0, user_id: 0, qty: 1) {
    this.id = id;
    this.product_id = product_id;
    this.user_id = user_id;
    this.qty = qty;
  }
}
