import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem: any

  constructor(
    private cartService:CartService,
    private msg:MessengerService
    ) { }

  ngOnInit(): void {
  }

  handleRemoveFromCart(){
    this.cartService.removeProductFromCart(this.cartItem.cart_item_id).subscribe(() => {
      this.msg.sendMsg(this.cartItem)
    })
  }

}
