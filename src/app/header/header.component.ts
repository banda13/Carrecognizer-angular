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
  

  constructor(private router: Router,private authService: AuthenticationService) {
    
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.authService.getEmitter().subscribe(user => this.currentUser = user);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
}
}
