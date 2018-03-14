import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserService } from '../_services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [UserService]
})
export class AdminComponent implements OnInit {
baseURL: string;
dataSource: any;
userDataSource: any;

  constructor(public userService: UserService) {
    this.baseURL = environment.odataEndpoint;
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      this.createUserDataSource();
    });
  }

  ngOnInit() {
  }

  createUserDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseURL + 'Users'
      },
      // expand: [''],
      select: [
        'user_id',
        'login_id',
        'manager_id',
        'first_name',
        'last_name',
        'email'
      ],
       filter: ['login_id', '<>', null]
      //  filter: ['customer_address/type_code', '=', 'bill']
      // filter: ['order_date', '>', this.filterDate]
   };
  }
}
