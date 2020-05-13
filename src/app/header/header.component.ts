import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  userDetails: User;

  constructor(private router: Router, private authService: AuthenticationService, private userService: UserService, private toastr: ToastrService) {

  }

  ngOnInit() {
    try {
      this.currentUser = this.authService.currentUserValue;
      this.authService.getEmitter().subscribe(user => this.currentUser = user);
    } catch (err) {
      console.log("Error happend while authentication user: " + err);
      this.logout();
    }
  }

  hasAdminPermission() {
    try {
      if (this.currentUser != null) {
        if (this.userDetails != null) {
          return this.userDetails.is_staff;
        }
        else {
          this.userService.getDetails().subscribe(user => {
            console.log(user);
            this.userDetails = user;
            return this.userDetails.is_staff;
          },
            error => {
              console.log("Error happend while authentication user: " + error);
              this.logout();
              return false;
            });
        }
      }
      else {
        return false;
      }
    } catch (err) {
      console.log("Error happend while authentication user: " + err);
      this.logout();
      return false;
    }
  }

  logout() {
    this.authService.logout();
    this.toastr.info("Your logged out!");
    //this.router.navigate(['/login']);
  }
}
