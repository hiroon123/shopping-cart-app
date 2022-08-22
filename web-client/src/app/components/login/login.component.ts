import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { MessengerService } from "src/app/services/messenger.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user!: User;
  current_user!: User;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private msg: MessengerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.clearLocalStorage();
  }

  buildForm() {
    this.loginForm = this.builder.group({
      emailaddress: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      rememberme: false,
    });
  }

  login() {
    var user = {
      email: this.loginForm.value.emailaddress,
      password: this.loginForm.value.password,
    };
    this.userService.loginUser(user).subscribe(
      () => {
        var user_json = localStorage.getItem("current_user");
        this.current_user =
          user_json !== null ? JSON.parse(user_json) : new User();
        this.msg.sendGetUserSessionMsg(this.current_user);
        this.router.navigate(["/shop"]);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
