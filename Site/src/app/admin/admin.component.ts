import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, Group, UserService } from '../_services/user.service';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [UserService]
})
export class AdminComponent implements OnInit {
@ViewChild(DxDataGridComponent) gridUsers: DxDataGridComponent;
baseURL: string;
dataSource: any;
userDataSource: any;
groupList: Array<Group>;
editUser;

  constructor(public userService: UserService) {
    this.baseURL = environment.odataEndpoint;
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      this.createUserDataSource();

    });
    userService.getGroups('').subscribe(res => {
      this.groupList = res.value;
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
      expand: ['user_group'],
      select: [
        'user_id',
        'login_id',
        'manager_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'user_group/hotjas_group_id'
      ],
       filter: ['login_id', '<>', null]
      //  filter: ['customer_address/type_code', '=', 'bill']
      // filter: ['order_date', '>', this.filterDate]
   };
  }

  onRowClick(e) {
    if (e.data) {
      console.log('Selected User: ', e.data);
      this.editUser = e.data;
    }
  }

  addRoleItem(e) {
    const newRole = {
      hotjas_group_id: -1
    };
    this.editUser.user_group.push(newRole);
  }

  deleteUserRole(user_id, role_id) {
    const index = this.editUser.user_group.findIndex(x => x.hotjas_group_id === role_id);

    this.editUser.user_group.splice(index);
  }
}
