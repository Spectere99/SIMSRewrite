import { Component, OnInit, Input } from '@angular/core';
import { CustomerInfo, Service } from './customer-info.service';
import { StateService, StateInfo } from '../../_shared/states.service';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, CustomerAddress } from '../../_services/customer.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ Service, StateService ]
})
export class CustomerInfoComponent implements OnInit {
@Input() customer: any;
@Input() userList: Array<any>;
lookupDataSource: any;
addressTypes: any;
stateList: any;

ctrlHasFocus: string;
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private customerService: CustomerService,
            private lookupService: LookupService, private usStateService: StateService) {
    console.log(this.customer);
    console.log('userList', this.userList);
    this.stateList = this.usStateService.getStateList();
    console.log('States', this.stateList);
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createAddressTypeDataSource();
    });
  }

  createAddressTypeDataSource() {
    this.addressTypes = this.lookupDataSource.filter(item => item.class === 'addr');
    console.log('addr Types', this.addressTypes);
  }

  removeAddress(customerAddressId: number) {
    console.log('Removing Address', customerAddressId);
    console.log('Customer List', this.customer);
    // Remove contact from list based on customerId
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The Result', result);
      if (result) {
        this.customer = this.customer.customer_address.filter(p => p.customer_address_id !== customerAddressId);

        // Remove contact from the database using Web service call.
        this.customerService.deleteCustomerAddress('rwflowers', customerAddressId)
          .subscribe(res => {
            this.snackBar.open('Customer Address Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    });
  }

  addAddress(customerId: number) {
    const newAddress: CustomerAddress = {
      customer_address_id: 0,
      customer_id: customerId,
      type_code: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      zip: null,
  };
    this.customer.customer_address.unshift(newAddress);
  }

  saveAddress(customerAddress: CustomerAddress) {
    console.log('Customer Address on Save', customerAddress);
      if (customerAddress.customer_address_id === 0) {
        this.customerService.addCustomerAddress('rwflowers', customerAddress)
        .subscribe(res => {
          console.log('Save address Return', res);
          this.snackBar.open('Customer Address Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      } else {
        this.customerService.updateCustomerAddress('rwflowers', customerAddress)
        .subscribe(res => {
          console.log('Update address Return', res);
          this.snackBar.open('Customer Address Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
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
