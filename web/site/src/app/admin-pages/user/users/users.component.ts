import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user';

@Component({
  selector: 'ss-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  cols: any[];

  constructor(private service: UserService, private messageService: MessageService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAdminUsers().subscribe((users: User[]) => {
      if (users) {
        this.users = users;
      }
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'mobileNo', header: 'Mobile No', width: '16%' },
      { field: 'email', header: 'Email' },
      { field: 'authorities', header: 'Role' },
      { field: 'id', header: 'Edit', width: '10%' }
    ];

  }

  parseAuthority(authorities) {

    const newAuth = [];

    authorities.forEach(role => {
      newAuth.push(role.replace('ROLE', '').replace('_', ' '));
    })

    return newAuth;
  }

}
