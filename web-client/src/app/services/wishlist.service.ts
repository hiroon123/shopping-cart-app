import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { wishListUrl } from 'src/app/config/api';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http:HttpClient) { }

  loadFromWishlist(){
    return this.http.get<any>(wishListUrl).pipe(
      map((result:any[]) => {
        let productIds: any[] = []
        result.forEach(item => productIds.push(item.id))
        return productIds
      }
      )
    )
    
  }

  addToWishlist(prod_id:number){
    return this.http.post(wishListUrl, {id:prod_id})
  }

  removeFromWishlist(prod_id:number){
    return this.http.delete(wishListUrl+'/'+prod_id)
  }
}
