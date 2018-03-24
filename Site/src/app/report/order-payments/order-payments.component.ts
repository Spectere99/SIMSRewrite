import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { ReportingService } from '../../_services/report.service';
import { UserService } from '../../_services/user.service';

import { DxDataGridComponent,
  DxDataGridModule } from 'devextreme-angular';



@Component({
  selector: 'app-order-payments',
  templateUrl: './order-payments.component.html',
  styleUrls: ['./order-payments.component.scss'],
  providers: [ReportingService, LookupService, UserService]
})
export class OrderPaymentsComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  baseURL = environment.reportingEndpoint;
  dataSource: any;
  lookupDataSource: any;
  orderTypes: any;
  statusTypes: any;
  paymentDate;
  userDataSource: any;
  paymentTypes: Array<LookupItem>;

    constructor(public reportService: ReportingService, lookupService: LookupService, userService: UserService) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.paymentDate = today.toLocaleDateString();
      lookupService.loadLookupData('').subscribe(res => {
        this.lookupDataSource = res.value;
        this.orderTypes = this.createLookupTypeSource('otyps');
        this.statusTypes = this.createLookupTypeSource('ord');
        this.paymentTypes = this.createLookupTypeSource('pms');
        this.createOrderPaymentDataSource();
      });
      userService.getUsers('').subscribe(res => {
        this.userDataSource = res.value;
        console.log(this.userDataSource);
      });
    }

    createLookupTypeSource(className: string): any {
      return this.lookupDataSource.filter(item => item.class === className);
    }

    createOrderPaymentDataSource() {
      this.dataSource = {
        store: {
            type: 'odata',
            url: this.baseURL + 'PaymentReporting'
        },
        expand: ['order_rpt'],
        select: ['order_id',
          'payment_date',
          'payment_type_code',
          'payment_amount',
          'payment_type_code',
          'order_rpt/order_number',
          'order_rpt/order_status',
          'order_rpt/ship_attn',
          'order_rpt/order_date',
          'order_rpt/order_type',
          'order_rpt/order_due_date',
          'order_rpt/total',
          'order_rpt/balance_due',
          'order_rpt/contact',
          'order_rpt/taken_user_id']
      };
    }

    getUserFullName(item) {
      // console.log('getUserFullName', item);
      // return 'User Name HERE';
      return item.first_name + ' ' + item.last_name;
    }

    formatDollarValue(data) {
      return '$' + data.payment_amount;
    }

    setOrderDate(e) {
      console.log(e);
      console.log('dateValue', this.paymentDate);
      const newDateVal = new Date(e);

      console.log('newDateVal', newDateVal.toLocaleDateString());
      this.paymentDate = newDateVal.toLocaleDateString();
      this.dataGrid.instance.filter(['order_date', '=', newDateVal]);

    }
    ngOnInit() {
      /* this.reportService.getOrderBalanceData('').subscribe(res => {
        this.dataSource = res;
      }); */
    }

}
