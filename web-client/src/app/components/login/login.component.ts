import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;

  constructor(
    private builder:FormBuilder,
    private userService:UserService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.loginForm = this.builder.group({
      emailaddress:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      rememberme:false
    })
  }

  //Save data by calling userService->addUser() method
  login(){
    var user = {
      "email":this.loginForm.value.emailaddress,
      "password":this.loginForm.value.password
    };
    this.userService.loginUser(user).subscribe((result) => {
      console.log(result);
    })
  }

}
