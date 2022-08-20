import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product";
import { productURL } from "src/app/config/api";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(productURL);
  }

  getSingleProduct(id: number): Observable<Product> {
    return this.http.get<Product>(productURL + "/" + id);
  }
}
