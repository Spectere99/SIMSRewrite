import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CustomerService, CustomerPerson } from '../../_services/customer.service';
import { LookupService } from '../../_services/lookups.service';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: [CustomerService]
})
export class ContactInfoComponent implements OnInit {
  @Input() customer: any;
  lookupDataSource: Array<any>;
  personTypes: any;
  phoneTypes: any;
  dirtyRecords: Array<CustomerPerson>;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar,
    public customerService: CustomerService, lookupService: LookupService) {
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
      this.createPhoneTypeDataSource();
    });
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT').sort(function (obj1, obj2) {
      return obj1.order_by - obj2.order_by;
    });
  }

  createPhoneTypeDataSource() {
    this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
  }

  removeContact(customerPersonId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log('The Result', result);
      if (result) {
        const contactToRemove = this.customer.customer_person.filter(p => p.customer_person_id === customerPersonId);
        this.customer.customer_person = this.customer.customer_person.filter(p => p.customer_person_id !== customerPersonId);

        // Remove contact from the database using Web service call.

        if (customerPersonId > 0) {
          console.log('Removing Contact', contactToRemove[0]);
          contactToRemove[0].status_code = 'inact';
          this.customerService.updateCustomerContact('', contactToRemove[0])
            .subscribe(res => {
              this.snackBar.open('Customer Contact Deleted!', '', {
                duration: 4000,
                verticalPosition: 'top'
              });
            });
        }
      } else {
        this.snackBar.open('Customer Contact Deleted!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });

      }
    });
  }

  batchSave(customer_id: number) {
    // Loop through the Customer Contacts and Save each.
    // console.log('customer-contacts batchSave', customer_id);
    if (this.customer.customer_person) {
      for (let x = 0; x < this.customer.customer_person.length; x++) {
        this.customer.customer_person[x].customer_id = customer_id;
        this.saveContact(this.customer.customer_person[x]).subscribe();
      }
    }
    return this.customer.customer_person;
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
      'phone_2_ext': null,
      'status_code': 'act'
    };
    if (this.customer.customer_person === undefined) {
      this.customer.customer_person = new Array<CustomerPerson>();
    }
    this.customer.customer_person.unshift(newContact);
  }

  saveContact(customerContact: CustomerPerson) {
    // console.log('Customer Contact on Save', customerContact);
    if (customerContact.customer_person_id === 0) {
      return this.customerService.addCustomerContact('rwflowers', customerContact)
        .map(res => {
          // console.log('Savecontact Return', res);
          this.snackBar.open('Customer Contact Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return res;
        });
    } else {
      return this.customerService.updateCustomerContact('rwflowers', customerContact)
        .map(res => {
          // console.log('Update contact Return', res);
          this.snackBar.open('Customer Contact Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return res;
        });
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('contact-info:ngOnChange', this.customer);
  }

}
