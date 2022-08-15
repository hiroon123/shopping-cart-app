import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, observable } from "rxjs";
import { map } from "rxjs";
import { cartURL, productURL } from "../config/api";
import { Product } from "../models/product";
import { CartItem } from "../models/cart-item";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  product!: Product;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(cartURL).pipe(
      map((result: any[]) => {
        let cartItems: CartItem[] = [];
        for (let item of result) {
          let productExist = false;

          for (let index in cartItems) {
            if (cartItems[index].product_id == item.product_id) {
              cartItems[index].qty++;
              productExist = true;
              break;
            }
          }

          if (!productExist) {
            cartItems.push(
              new CartItem(
                item.id,
                item.product_id,
                item.user_id,
                new Product(),
                1
              )
            );
          }
        }
        this.addProductDataToCartItems(cartItems);
        return cartItems;
      })
    );
  }

  addProductDataToCartItems(cartItems: CartItem[]) {
    for (let item of cartItems) {
      this.productService
        .getSingleProduct(item.product_id)
        .subscribe((product) => {
          item.product = product;
        });
    }
  }

  addProductToCart(cartItem: CartItem) {
    console.log(cartItem);
    return this.http.post(cartURL, cartItem);
  }

  removeProductFromCart(cart_item_id: number) {
    return this.http.delete(cartURL + "/" + cart_item_id);
  }
}
