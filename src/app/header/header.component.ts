import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  userDetails : User;

  constructor(private router: Router,private authService: AuthenticationService, private userService: UserService) {
    
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.authService.getEmitter().subscribe(user => this.currentUser = user);
  }

  hasAdminPermission() {
      if(this.currentUser != null) {
        if(this.userDetails != null){
          return this.userDetails.is_staff;
        }
        else{
          this.userService.getDetails().subscribe(user => {
            this.userDetails = user;
            return this.userDetails.is_staff; 
          });
        }
      }
      else{
        return false;
      }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
}
}
