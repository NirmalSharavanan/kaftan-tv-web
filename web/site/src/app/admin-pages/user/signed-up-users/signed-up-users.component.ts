import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'ss-signed-up-users',
  templateUrl: './signed-up-users.component.html',
  styleUrls: ['./signed-up-users.component.scss']
})
export class SignedUpUsersComponent implements OnInit {

  cols: any[];
  users: User[];
  allUsers: User[];

  constructor(private service: UserService) { }

  ngOnInit() {
    this.getSignupUsers();
    this.cols = [
      { field: 'name', header: 'Name', width: '15%' },
      { field: 'email', header: 'Email', width: '20%' },
      { field: 'mobileNo', header: 'Mobile No', width: '15%' },
      { field: 'authorities', header: 'Role', width: '20%' },
      { field: 'created_at', header: 'Registration Date', width: '15%' },
      { field: 'lastLogin_at', header: 'Last Logged in Date', width: '15%' }
    ];
  }

  getSignupUsers() {
    this.service.getSignupUsers().subscribe((users: User[]) => {
      if (users) {
        this.allUsers = users;
        this.users = users;
      }
    })
  }

  parseAuthority(authorities) {

    const newAuth = [];

    authorities.forEach(role => {
      newAuth.push(role.replace('ROLE', '').replace('_', ' '));
    })

    return newAuth;
  }

}
