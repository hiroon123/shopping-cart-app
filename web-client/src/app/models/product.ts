export class Product {
    prod_id:number;
    prod_name :string;
    prod_desc:string;
    prod_price:number;
    prod_img_url:string;

    constructor(prod_id=0, prod_name='No Name', prod_desc = 'No Description', prod_price = 0, prod_img_url = 'https://www.daveraine.com/img/products/no-image.jpg'){
        this.prod_id=prod_id;
        this.prod_name=prod_name;
        this.prod_desc=prod_desc;
        this.prod_price=prod_price;
        this.prod_img_url=prod_img_url;
    }
}
