import { Injectable } from "@angular/core";
import { Subject } from "rxjs"; //Listening and triggering mechanism
import { Product } from "../models/product";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class MessengerService {
  subject = new Subject<Product>();
  subjectUser = new Subject<User>();

  constructor() {}

  sendMsg(product: Product) {
    this.subject.next(product); //Trigger Event (Subject)
  }

  getMsg() {
    return this.subject.asObservable(); //Recieve Event (Observable)
  }

  //Handle Login Authentication
  sendGetUserSessionMsg(user: User) {
    return this.subjectUser.next(user);
  }

  getUserSessionMsg() {
    return this.subjectUser;
  }
}
