import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService) {

  }

  ngOnInit() {
    this.userService.getDetails().subscribe(user => {
      this.currentUser = user;
    });
  }

}
