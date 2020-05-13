import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private authService: AuthenticationService, private toastr: ToastrService) {

  }

  ngOnInit() {
    try {
      this.userService.getDetails().subscribe(user => {
        this.currentUser = user;
      });
    } catch (err) {
      this.logout();
    }
  }

  logout() {
    this.authService.logout();
    this.toastr.info("Your logged out!");
    this.currentUser = null;
    //this.router.navigate(['/login']);
  }

}
