import { Component, OnInit, Input } from '@angular/core';
import { CustomerInfo, Service } from './customer-info.service';
import { StateService, StateInfo } from '../../_shared/states.service';
import { LookupService } from '../../_services/lookups.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ Service, StateService ]
})
export class CustomerInfoComponent implements OnInit {
@Input() customer: CustomerInfo;
@Input() userList: Array<any>;
lookupDataSource: any;
addressTypes: any;
stateList: any;

ctrlHasFocus: string;
  constructor(private customerService: Service, private lookupService: LookupService, private usStateService: StateService) {
    console.log(this.customer);
    console.log('userList', this.userList);
    this.stateList = this.usStateService.getStateList();
    console.log('States', this.stateList);
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createAddressTypeDataSource();
    });
    // const customerReturn = customerService.getCustomerInfo();
    // if (customerReturn) {
    //  this.customerInfo = customerReturn[0];
    //  console.log('customerInfo', this.customerInfo);
    // }
  }

  createAddressTypeDataSource() {
    this.addressTypes = this.lookupDataSource.filter(item => item.class === 'addr');
    console.log('addr Types', this.addressTypes);
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
