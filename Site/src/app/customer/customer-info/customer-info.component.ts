import { Component, OnInit, Input } from '@angular/core';
import { CustomerInfo, Service } from './customer-info.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ Service ]
})
export class CustomerInfoComponent implements OnInit {
@Input() customer: CustomerInfo;
@Input() userList: Array<any>;

ctrlHasFocus: string;
  constructor(private customerService: Service) {
    console.log(this.customer);
    console.log('userList', this.userList);
    // const customerReturn = customerService.getCustomerInfo();
    // if (customerReturn) {
    //  this.customerInfo = customerReturn[0];
    //  console.log('customerInfo', this.customerInfo);
    // }
  }

  onFocus() {
    this.ctrlHasFocus = 'active';
  }
  showValues() {
    alert(this.customer.customer_name);
  }
  ngOnInit() {
  }

}
