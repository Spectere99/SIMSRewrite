import { Component, OnInit } from '@angular/core';
import { CustomerInfo, Service } from './customer-info.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ Service ]
})
export class CustomerInfoComponent implements OnInit {
customerInfo: CustomerInfo;

  constructor(private customerService: Service) {
    const customerReturn = customerService.getCustomerInfo();
    if (customerReturn) {
      this.customerInfo = customerReturn[0];
      console.log('customerInfo', this.customerInfo);
    }
  }

  showValues() {
    alert(this.customerInfo.customer_name);
  }
  ngOnInit() {
  }

}
