import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

/**
 *
 * @param form
 * @returns
 */
function passwordsMatchValidator(form: any) {
  const password = form.get("password");
  const verifypassword = form.get("verifypassword");

  if (password.hasError("required")) {
    return null;
  }

  if (password.value !== verifypassword.value) {
    verifypassword.setErrors({ passwordsNotMatch: true });
  } else {
    verifypassword.setErrors(null);
  }

  return null;
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = null;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.builder.group(
      {
        firstname: ["", Validators.required],
        lastname: ["", Validators.required],
        dob: ["", Validators.required],
        gender: "Male",
        emailaddress: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        verifypassword: ["", Validators.required],
      },
      {
        validators: passwordsMatchValidator,
      }
    );
  }

  //Save data by calling userService->addUser() method
  register() {
    var user = {
      email: this.registerForm.value.emailaddress,
      password: this.registerForm.value.password,
      first_name: this.registerForm.value.firstname,
      last_name: this.registerForm.value.lastname,
      dob: this.registerForm.value.dob,
      gender: this.registerForm.value.gender,
    };
    this.userService.registerUser(user).subscribe(
      () => {
        this.router.navigate(["/account-verify"], {
          queryParams: { u: user.email },
        });
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }
}
