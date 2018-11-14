import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LookupService } from '../../_services/lookups.service';
import { ReportingService } from '../../_services/report.service';
import { UserService } from '../../_services/user.service';

import { DxDataGridComponent,
  DxDataGridModule } from 'devextreme-angular';


@Component({
  selector: 'app-order-balance',
  templateUrl: './order-balance.component.html',
  styleUrls: ['./order-balance.component.scss'],
  providers: [ReportingService, LookupService, UserService]
})
export class OrderBalanceComponent implements OnInit {
@ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
baseURL = environment.reportingEndpoint;
dataSource: any;
lookupDataSource: any;
orderTypes: any;
statusTypes: any;
userDataSource: any;
orderStartDate;

  constructor(public reportService: ReportingService, lookupService: LookupService, userService: UserService) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.orderStartDate = today.toLocaleDateString();
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.orderTypes = this.createLookupTypeSource('otyps');
      this.statusTypes = this.createLookupTypeSource('ord');
      this.createOrderBalanceDataSource();
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createOrderBalanceDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseURL + 'OrderReporting'
      },
      expand: ['customer_rpt'],
      select: ['order_id',
      'order_number',
      'order_status',
      'ship_attn',
      'order_date',
      'order_type',
      'order_due_date',
      'total',
      'balance_due',
      'payments',
      'contact',
      'taken_user_id',
      'customer_rpt/customer_name']
    };
  }

  getUserFullName(item) {
    // console.log('getUserFullName', item);
    // return 'User Name HERE';
    return item.first_name + ' ' + item.last_name;
  }

  setOrderDate(e) {
    // console.log(e);
    // console.log('dateValue', this.orderStartDate);
    const newDateVal = new Date(e);

    // console.log('newDateVal', newDateVal.toLocaleDateString());
    this.orderStartDate = newDateVal.toLocaleDateString();
    this.dataGrid.instance.filter(['order_date', '=', newDateVal]);

  }
  ngOnInit() {
    /* this.reportService.getOrderBalanceData('').subscribe(res => {
      this.dataSource = res;
    }); */
  }

}
