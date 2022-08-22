import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import {
  authenticateUserUrl,
  loginUserUrl,
  registerUserUrl,
  sendVeriEmailUrl,
  VeriUserUrl,
} from "../config/api";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  current_user!: User;
  constructor(private http: HttpClient) {}

  registerUser(data: any) {
    return this.http.post(registerUserUrl, data);
  }

  sendVerificationEmail(data: any) {
    console.log("Sending Email...");
    return this.http.post(sendVeriEmailUrl + "?email_address=" + data, null);
  }

  verifyUser(email: any, token: any) {
    return this.http.post(
      VeriUserUrl + "?email=" + email + "&token=" + token,
      null
    );
  }

  loginUser(data: any) {
    return this.http.post(loginUserUrl, data).pipe(
      map((User) => {
        //Save user session data to local storage
        localStorage.setItem("current_user", JSON.stringify(User));
        return User;
      })
    );
  }

  getUserSessionData() {
    var user_json = localStorage.getItem("current_user");
    this.current_user = user_json !== null ? JSON.parse(user_json) : new User();
    return this.current_user;
  }

  /*authenticateUser(): Observable<User> {
    return this.http.get<User>(authenticateUserUrl, { withCredentials: true });
  }*/
}
