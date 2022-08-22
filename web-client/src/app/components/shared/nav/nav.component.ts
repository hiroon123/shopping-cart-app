import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { MessengerService } from "src/app/services/messenger.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    private msg: MessengerService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    var user_json = localStorage.getItem("current_user");
    this.user = user_json !== null ? JSON.parse(user_json) : new User();
    console.log(this.user);
  }

  logOutUser() {}
}
