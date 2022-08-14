import { Component, Input, OnInit } from "@angular/core";
import { Product } from "src/app/models/product";
import { CartService } from "src/app/services/cart.service";
import { MessengerService } from "src/app/services/messenger.service";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-cart-item",
  templateUrl: "./cart-item.component.html",
  styleUrls: ["./cart-item.component.css"],
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: any;
  product: Product = new Product();

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private msg: MessengerService
  ) {}

  ngOnInit(): void {
    this.loadProductData();
  }

  loadProductData() {
    this.productService
      .getSingleProduct(this.cartItem.product_id)
      .subscribe((product) => {
        this.product = product;
        console.log(this.product);
      });
  }

  handleRemoveFromCart() {
    this.cartService
      .removeProductFromCart(this.cartItem.cart_item_id)
      .subscribe(() => {
        this.msg.sendMsg(this.cartItem);
      });
  }
}
