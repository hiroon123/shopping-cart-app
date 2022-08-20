import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user!: User;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
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
        this.userService.authenticateUser().subscribe((user) => {
          this.user = user;
          console.log(user);
        });
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
}
