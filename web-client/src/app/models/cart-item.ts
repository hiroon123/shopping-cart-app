import { Product } from "./product"

export class CartItem {
    cart_item_id: number
    prod_id: number;
    prod_name: string;
    prod_price: number;
    prod_qty: number;
    prod_img_url: string;

    constructor(cart_item_id: 0, product: Product,prod_qty: 1 ){
        this.cart_item_id = cart_item_id;
        this.prod_id = product.prod_id;
        this.prod_name = product.prod_name;
        this.prod_price = product.prod_price;
        this.prod_img_url = product.prod_img_url;
        this.prod_qty = prod_qty;
    }
}


