import { Component, OnInit, OnChanges, Input } from '@angular/core';
/* import { CustomerInfo, Service } from './customer-info.service'; */
import { StateService, StateInfo } from '../../_shared/states.service';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer, CustomerDTO, CustomerAddress } from '../../_services/customer.service';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss'],
  providers: [StateService, LookupService]
})
export class ContactAddressComponent implements OnInit {

  @Input() customer: any;
  customerList: Array<any>;
  lookupDataSource: any;
  addressTypes: any;
  stateList: any;
  panelExpanded: boolean;

  ctrlHasFocus: string;
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private customerService: CustomerService,
    private lookupService: LookupService, private usStateService: StateService, public datePipe: DatePipe) {

    this.stateList = this.usStateService.getStateList();
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createAddressTypeDataSource();
      // this.createStatusTypeDataSource();
    });
    customerService.getActiveParentCustomers('rwflowers').subscribe(res => {
      this.customerList = res.value;
      // console.log('customerList', this.customerList);
    });
    this.panelExpanded = true;
  }

  selected(value: any): void {
    // console.log('Selected value is: ', value);
  }

  removed(value: any): void {
    // console.log('Removed value is: ', value);
  }

  typed(value: any): void {
    // console.log('New search input: ', value);
  }

  refreshValue(value: any): void {
    // console.log('refreshValue', value);
    this.customer.parent_id = value;
  }

  createAddressTypeDataSource() {
    this.addressTypes = this.lookupDataSource.filter(item => item.class === 'addr');
    // console.log('addr Types', this.addressTypes);
  }

  removeAddress(customerAddressId: number) {
    // console.log('Removing Address', customerAddressId);
    // console.log('Customer List', this.customer);
    // Remove contact from list based on customerId
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log('The Result', result);
      if (result) {
        // this.customer = this.customer.customer_address.filter(p => p.customer_address_id !== customerAddressId);
        console.log('CustomerAddressId', customerAddressId);
        if (customerAddressId > 0) {
          // Remove contact from the database using Web service call.
          // console.log('Calling Delete Web Service');
          this.customerService.deleteCustomerAddress('rwflowers', customerAddressId)
            .subscribe(res => {
              this.customer.customer_address = this.customer.customer_address.filter(p => p.customer_address_id !== customerAddressId);
              this.snackBar.open('Customer Address Deleted!', '', {
                duration: 4000,
                verticalPosition: 'top'
              });
            });
        } else {
          this.customer.customer_address = this.customer.customer_address.filter(p => p.customer_address_id !== customerAddressId);
        }
      }
    });
  }

  addAddress(customerId: number) {
    const newAddress: CustomerAddress = {
      'customer_address_id': 0,
      'customer_id': customerId,
      'type_code': null,
      'address_1': null,
      'address_2': null,
      'city': null,
      'state': null,
      'zip': null,
    };
    if (!this.customer.customer_address) {
      this.customer.customer_address = [];
    }
    const tempNewAddr = this.customer.customer_address.filter(p => p.customer_address_id <= 0);
    newAddress.customer_address_id = (tempNewAddr.length * -1);
    this.customer.customer_address.unshift(newAddress);
    // console.log('Customer Address List after add', this.customer.customer_address);
    this.panelExpanded = true;
  }

  batchSave(customer_id: number) {
    if (this.customer.customer_address) {
      for (let x = 0; x < this.customer.customer_address.length; x++) {
        this.customer.customer_address[x].customer_id = customer_id;
        // console.log('Address on Save Customer', this.customer.customer_address);
        this.saveAddress(this.customer.customer_address[x]).subscribe();
      }
    }
    return this.customer.customer_address;
  }
  saveAddress(customerAddress: CustomerAddress) {
    // console.log('Customer Address on Save', customerAddress);
    if (customerAddress.customer_address_id <= 0) {
      customerAddress.customer_address_id = 0;
      return this.customerService.addCustomerAddress('rwflowers', customerAddress)
        .map(res => {
          // console.log('Save address Return', res);
          this.snackBar.open('Customer Address Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return customerAddress.customer_id;
        });
    } else {
      return this.customerService.updateCustomerAddress('rwflowers', customerAddress)
        .map(res => {
          // console.log('Update address Return', res);
          this.snackBar.open('Customer Address Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return customerAddress.customer_id;
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('contact-address:ngOnChange', this.customer);
  }

}
