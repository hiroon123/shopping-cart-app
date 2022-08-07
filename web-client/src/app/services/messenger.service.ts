import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; //Listening and triggering mechanism
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  subject = new Subject<Product>();

  constructor() { }

  sendMsg(product:Product) {
    this.subject.next(product) //Trigger Event (Subject)
  }

  getMsg() {
    return this.subject.asObservable() //Recieve Event (Observable)
  }
}
