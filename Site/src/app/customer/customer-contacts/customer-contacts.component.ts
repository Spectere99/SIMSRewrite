import { Component, OnInit, Input } from '@angular/core';
import { CustomerService, CustomerPerson } from '../../_services/customer.service';
import { LookupService } from '../../_services/lookups.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
      MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';

@Component({
  selector: 'app-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.css'],
  providers: [ CustomerService ]
})
export class CustomerContactsComponent implements OnInit {
@Input() customer: any;
lookupDataSource: Array<any>;
personTypes: any;
phoneTypes: any;
dirtyRecords: Array<CustomerPerson>;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar,
              public customerService: CustomerService, lookupService: LookupService) {
    /* const customerReturn = customerService.getCustomerContacts();
    if (customerReturn) {
      this.customerContact = customerReturn[0];
      console.log('customerContact', this.customerContact);
    } */
    // this.customerContact = this.customer;
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
      this.createPhoneTypeDataSource();
    });
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT').sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order_by - obj2.order_by;
    });
    console.log('PersonTypes', this.personTypes);
  }
  createPhoneTypeDataSource() {
    this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
    console.log('PhoneTypes', this.phoneTypes);
  }

  removeContact(customerPersonId: number) {
    console.log('Removing Contact', customerPersonId);
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
        this.customer.customer_person = this.customer.customer_person.filter(p => p.customer_person_id !== customerPersonId);

        // Remove contact from the database using Web service call.
        this.customerService.deleteCustomerContact('rwflowers', customerPersonId)
          .subscribe(res => {
            this.snackBar.open('Customer Contact Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    });

  }

  addContact(customerId: number) {
    const newContact: CustomerPerson = {
      'customer_person_id': 0,
      'customer_id': customerId,
      'setup_date': null,
      'person_type': 'prime',
      'first_name': '',
      'last_name': '',
      'email_address': null,
      'address_1': null,
      'address_2': null,
      'city': null,
      'state': null,
      'zip': null,
      'country': null,
      'phone_1': '',
      'phone_1_type': null,
      'phone_2': null,
      'phone_2_type': null,
      'ccnum': null,
      'ccexp_date': null,
      'ccverfcode': null,
      'phone_1_ext': null,
      'phone_2_ext': null
  };
    this.customer.customer_person.unshift(newContact);
  }

  saveContact(customerContact: CustomerPerson) {
    console.log('Customer Contact on Save', customerContact);
      if (customerContact.customer_person_id === 0) {
        this.customerService.addCustomerContact('rwflowers', customerContact)
        .subscribe(res => {
          console.log('Savecontact Return', res);
          this.snackBar.open('Customer Contact Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      } else {
        // Call UpdateCustomerContact Method
      }
  }

  formatPhone(inPhone: string): string {
    if (inPhone === undefined) { return ''; }
    let rawNumber = (inPhone === undefined) ||
                      (inPhone === null) ? '' : inPhone.toString();
    // console.log('rawNumber:', rawNumber);
    rawNumber = String(rawNumber);
    rawNumber = rawNumber.replace(/[^0-9]*/g, '');
    let formattedNumber = rawNumber;
    const c = (rawNumber[0] === '1') ? '1' : '';
    rawNumber = rawNumber[0] === '1' ? rawNumber.slice(1) : rawNumber;
    const area = rawNumber.substring(0, 3);
    const front = rawNumber.substring(3, 6);
    const end = rawNumber.substring(6, 10);
    if (front) {
      formattedNumber = (c + '(' + area + ') ' + front);
    }
      if (end) {
        formattedNumber += ('-' + end);
      }
    return formattedNumber;
  }
  ngOnInit() {
  }

}
