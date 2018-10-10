import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { ReportingService } from '../../_services/report.service';
import { UserService } from '../../_services/user.service';

import { DxDataGridComponent,
  DxDataGridModule} from 'devextreme-angular';

@Component({
  selector: 'app-order-quantities',
  templateUrl: './order-quantities.component.html',
  styleUrls: ['./order-quantities.component.scss'],
  providers: [ReportingService, LookupService, UserService]
})

export class OrderQuantitiesComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  baseURL = environment.reportingEndpoint;
  dataSource: any;
  lookupDataSource: any;
  orderTypes: any;
  statusTypes: any;
  paymentDate;
  userDataSource: any;
  paymentTypes: Array<LookupItem>;
  orderQuantities2: any;
  currentDate: Date = new Date();


    constructor(public reportService: ReportingService, lookupService: LookupService, userService: UserService) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.paymentDate = today.toLocaleDateString();
      lookupService.loadLookupData('').subscribe(res => {
        this.lookupDataSource = res.value;
        this.orderTypes = this.createLookupTypeSource('otyps');
        this.statusTypes = this.createLookupTypeSource('ord');
        this.paymentTypes = this.createLookupTypeSource('pms');
        this.createOrderQuantitiesDataSource();
      });
      reportService.getOrderQuantityData('').subscribe(res2 => {
        this.orderQuantities2 = res2.value;
        console.log('order-quantities:constructor -', this.orderQuantities2);
      });
      userService.getUsers('').subscribe(res => {
        this.userDataSource = res.value;
        console.log(this.userDataSource);
      });


    }

    customizeArgLabelText(pointInfo: any) {
      console.log('customizeArgLabelText', pointInfo);
      const labelDate = new Date(pointInfo.value);
      return labelDate.toLocaleDateString();
    }
    customizeTooltip(arg: any) {
      return {
          text: arg.seriesName + ' (' + arg.valueText +')'
      };
  }

    createLookupTypeSource(className: string): any {
      return this.lookupDataSource.filter(item => item.class === className);
    }

    createOrderQuantitiesDataSource() {
      this.dataSource = {
        store: {
            type: 'odata',
            url: this.baseURL + 'OrderQuantitiesReporting'
        },
        expand: [],
        select: ['order_id',
          'order_number',
          'order_type',
          'order_type_desc',
          'order_date',
          'order_due_date',
          'total',
          'customer_name',
          'TOTAL_QTY']
      };
      console.log('order-quantities-component:createOrderQuantitiesDataSource', this.dataSource);
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
