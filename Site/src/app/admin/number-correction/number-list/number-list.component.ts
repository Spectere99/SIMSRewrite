import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GlobalDataProvider } from '../../../_providers/global-data.provider';
import { LookupService, LookupItem } from '../../../_services/lookups.service';
import { OrderMaster, OrderService, Order, OrderDetail } from '../../../_services/order.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { UserService, User } from '../../../_services/user.service';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-number-list',
  templateUrl: './number-list.component.html',
  styleUrls: ['./number-list.component.scss']
})
export class NumberListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
  dataSource: any;
  baseUrl = environment.odataEndpoint;
  userProfile;
  lookupDataSource: Array<LookupItem>;
  lookupClassDataSource: Array<LookupItem>;

  constructor(globalDataProvider: GlobalDataProvider, public lookupService: LookupService,
              public userService: UserService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    // this.lookupDataSource = globalDataProvider.getLookups();
    // this.lookupClassDataSource = this.createSortedLookupTypeSource('CLASS');
    this.createOrderDataSource();
   }

   createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createSortedLookupTypeSource(className: string): any {
    const sortedArray = this.lookupDataSource.filter(item => item.class === className).sort(this.compareValues('description'));
    // console.log('sortedLookupType Array', sortedArray);
    return sortedArray;
  }

  compareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  createOrderDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseUrl + 'orders',
          key: 'order_id',
          keyType: 'Int32',
          version: 3,
          jsonp: false,
          beforeSend: function (url, async, method, timeout, params, payload, headers) {
            // console.log('beforeSend', url, async, method, timeout, params, payload, headers);
          },
          onInserting: function (values) {
            /* const today = new Date();
            if (values.hasOwnProperty('is_active')) {
              values.is_active = values.is_active ? 'Y' : 'N';
            } */
            console.log('values', values);
          },
          onUpdating: function (key, values) {
            // console.log('key', key);
            console.log('values', values);
            /* const today = new Date();
            if (values.hasOwnProperty('is_active')) {
              values.is_active = values.is_active ? 'Y' : 'N';
            } */
          }
      },
      expand: ['customer'],
      select: [
        'order_id',
        'customer_id',
        'order_number',
        'order_date',
        'order_due_date',
        'customer/customer_name'
      ],
      beforeSend: function(request) {
        request.timeout = environment.connectionTimeout;
      }// ,
      // filter: ['order_date', '=', this.getToday()]
   };
  }

  getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
/*
  onInitNewRow(e) {
    // console.log('onInitNewRow', e);
    // console.log('UserProfile', this.userProfile);
    const today = new Date();
    e.data.created_by = this.userProfile.profile.login_id.toString().toUpperCase();
    e.data.created_date = today.toISOString();
    e.data.updated_by = this.userProfile.profile.login_id.toString().toUpperCase();
    e.data.updated_date = today.toISOString();
    // console.log('onInitNewRow', e);
  } */
/*
  onRowUpdating(e) {
    // console.log('onRowUpdating', e);
    const today = new Date();
    e.newData.updated_by = this.userProfile.profile.login_id.toString().toUpperCase();
    e.newData.updated_date = today.toISOString();
  } */
  /* setIsActiveInd(data) {
    // console.log('setIsActiveInd', data);
    if (data === undefined) { return false; }
    return data.is_active === 'Y';
  } */

  ngOnInit(): void {

  }

}
