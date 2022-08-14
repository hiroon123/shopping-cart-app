import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, observable } from "rxjs";
import { map } from "rxjs";
import { cartURL } from "../config/api";
import { Product } from "../models/product";
import { CartItem } from "../models/cart-item";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(cartURL).pipe(
      map((result: any[]) => {
        let cartItems: CartItem[] = [];

        for (let item of result) {
          let productExist = false;

          for (let index in cartItems) {
            if (cartItems[index].id === item.product.id) {
              cartItems[index].qty++;
              productExist = true;
              break;
            }
          }

          if (!productExist) {
            cartItems.push(new CartItem(item.id, item.product_id, item.qty));
          }
        }

        return cartItems;
      })
    );
  }

  addProductToCart(cartItem: CartItem): Observable<any> {
    console.log(cartItem);
    return this.http.post(cartURL, { cartItem });
  }

  removeProductFromCart(cart_item_id: number) {
    return this.http.delete(cartURL + "/" + cart_item_id);
  }
}
