import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserDTO, Group, UserService, UserGroupDTO } from '../_services/user.service';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { AuthenticationService } from '../_services/authentication.service';
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
  message: string;
  userProfile;

  constructor(public userService: UserService, private authService: AuthenticationService, public snackBar: MatSnackBar) {
    this.baseURL = environment.odataEndpoint;
    this.userProfile = JSON.parse(authService.getUserToken());
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
      // console.log('Selected User: ', e.data);
      this.editUser = e.data;
      const pwd = this.editUser.password;
      this.editUser.password = atob(pwd);
      // console.log('editUser: ', this.editUser);
    }
  }

  newUser() {
    const newUsr: User = {
      user_id: -1,
      login_id: '',
      manager_id: null,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      user_group: []
    };
    this.editUser = newUsr;
  }

  saveUser() {
    // console.log('saveUser', this.editUser);
    const saveUsr: UserDTO = {
      active_order_ind: null,
      assigned_to_search_for: null,
      corr_disp: null,
      corr_type: null,
      current_group: null,
      current_table: null,
      customer_search_code: null,
      customer_search_for: null,
      edit_email: null,
      edit_message: null,
      edit_subject: null,
      email: this.editUser.email,
      first_name: this.editUser.first_name,
      language_code: null,
      last_name: this.editUser.last_name,
      login_attempt_count: null,
      login_id: this.editUser.login_id.toUpperCase(),
      lookup_item_code: null,
      manager_id: this.editUser.manager_id,
      order_parent_search_for: null,
      order_search_code: null,
      order_search_date: null,
      order_search_for: null,
      order_type_search_for: null,
      pass_change_1: null,
      pass_change_2: null,
      password: btoa(this.editUser.password),
      pricelist_type: null,
      report_sel: null,
      status_code: 'act',
      task_list_type: null,
      task_type_code: null,
      user_id: this.editUser.user_id,
      wu_id: 0
    };


    if (this.editUser.user_id > 0) {
      this.userService.updateUser(this.userProfile.login_id, saveUsr).subscribe(res => {
        this.userService.deleteUserGroup(this.userProfile.login_id.toUpperCase(), this.editUser.user_id).subscribe(res2 => {
          // console.log('return from updateUser', res);
          this.editUser.user_group.forEach(element => {
            const newUserGroup: UserGroupDTO = {
              user_id: this.editUser.user_id,
              hotjas_group_id: element.hotjas_group_id
            };
            this.userService.addUserGroup(this.userProfile.login_id.toUpperCase(), newUserGroup).subscribe();
          });
          this.snackBar.open('User Saved!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          this.gridUsers.instance.refresh();
        });
      });
    } else {
      this.userService.addUser(this.userProfile.login_id.toUpperCase(), saveUsr).subscribe(res => {
        this.snackBar.open('User Created!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
        this.gridUsers.instance.refresh();
      });
    }
  }
  addRoleItem(e) {
    const newRole = {
      hotjas_group_id: -1
    };
    this.editUser.user_group.push(newRole);
  }

  deleteUserRole(user_id, role_id) {
    // console.log('deleteUserRole', role_id);
    // console.log('deleteUserRole', this.editUser.user_group);
    const index = this.editUser.user_group.findIndex(x => x.hotjas_group_id === role_id);

    // console.log('deleteUserRole:index', index);
    this.editUser.user_group.splice(index);
  }
}
