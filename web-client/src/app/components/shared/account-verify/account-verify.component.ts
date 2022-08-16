import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-account-verify",
  templateUrl: "./account-verify.component.html",
  styleUrls: ["./account-verify.component.css"],
})
export class AccountVerifyComponent implements OnInit {
  verificationCodeForm!: FormGroup;
  errorMessage = "";
  emailaddress: string | undefined = "";
  input_code: string = "";

  constructor(
    private builder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.checkParams();
  }

  checkParams() {
    const emailaddress = this.route.snapshot.queryParamMap.get("u");
    if (emailaddress == "" || emailaddress == null) {
      this.errorMessage =
        "We could't send the verification code. Please go back and try again.";
    }
    this.emailaddress = emailaddress?.toString();
    this.sendVerificationCode();
  }

  buildForm() {
    this.verificationCodeForm = this.builder.group({
      s1: ["", [Validators.required]],
      s2: ["", [Validators.required]],
      s3: ["", [Validators.required]],
      s4: ["", [Validators.required]],
      s5: ["", [Validators.required]],
      s6: ["", [Validators.required]],
    });
  }

  sendVerificationCode() {
    this.userService.sendVerificationEmail(this.emailaddress).subscribe(
      () => {
        console.log("Verification Email Sent");
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }

  verify() {
    this.input_code =
      this.verificationCodeForm.value.s1 +
      this.verificationCodeForm.value.s2 +
      this.verificationCodeForm.value.s3 +
      this.verificationCodeForm.value.s4 +
      this.verificationCodeForm.value.s5 +
      this.verificationCodeForm.value.s6;
    this.input_code = this.input_code.toUpperCase();
    console.log(this.input_code);
    this.userService.verifyUser(this.emailaddress, this.input_code).subscribe(
      () => {
        console.log("User Verified");
        this.router.navigate(["/register-success"]);
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }
}
