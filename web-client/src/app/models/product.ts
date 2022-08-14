export class Product {
  id: number;
  product_name: string;
  product_desc: string;
  price: number;
  img1_url: string;

  constructor(
    id = 0,
    product_name = "No Name",
    product_desc = "No Description",
    price = 0,
    img1_url = "https://www.daveraine.com/img/products/no-image.jpg"
  ) {
    this.id = id;
    this.product_name = product_name;
    this.product_desc = product_desc;
    this.price = price;
    this.img1_url = img1_url;
  }
}
