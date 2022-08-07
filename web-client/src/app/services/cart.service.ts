import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item';
import { Observable, observable } from 'rxjs';
import { map } from 'rxjs';
import { cartItemsUrl } from '../config/api';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { }

  getCartItems(): Observable<CartItem[]>{
    return this.http.get<CartItem[]>(cartItemsUrl).pipe(
      map((result: any []) => {
        let cartItems : CartItem[] = []

        for(let item of result) {
          let productExist =false

          for(let index in cartItems){
            if(cartItems[index].prod_id===item.product.prod_id){
              cartItems[index].prod_qty++
              productExist =true
              break
            }
          }

          if(!productExist){
            cartItems.push(new CartItem(item.id,item.product,1))
          }
        }

        return cartItems
      })
    );
  }

  addProductToCart(product: Product):Observable<any>{
    return this.http.post(cartItemsUrl,{ product })
  }

  removeProductFromCart(cart_item_id:number){
    return this.http.delete(cartItemsUrl+'/'+cart_item_id)
  }
}
