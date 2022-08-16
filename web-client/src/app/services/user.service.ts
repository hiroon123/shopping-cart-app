import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { loginUserUrl, registerUserUrl, sendVeriEmailUrl } from "../config/api";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(data: any) {
    return this.http.post(registerUserUrl, data);
  }

  sendVerificationEmail(data: any) {
    return this.http.post(sendVeriEmailUrl + "?email_address=" + data, 0);
  }

  loginUser(data: any) {
    return this.http.post(loginUserUrl, data);
  }
}
