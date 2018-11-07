import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';

import { Globals } from '../../globals';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Customer, CustomerService } from '../../_services/customer.service';
// import { CustomerContactsComponent } from '../customer-contacts/customer-contacts.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { ContactAddressComponent } from '../contact-address/contact-address.component';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';

@Component({
  selector: 'app-customer-item',
  templateUrl: './customer-item.component.html',
  providers: [LookupService, CustomerService, UserService],
  styleUrls: ['./customer-item.component.scss']
})
export class CustomerItemComponent implements OnInit {
  baseURL = environment.odataEndpoint;
  @Input() customer: any;
  @Output() onCustomerSaved = new EventEmitter<boolean>();
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild(CustomerInfoComponent) customerInfoCmpt: CustomerInfoComponent;
  @ViewChild(ContactInfoComponent) contactInfoCmpt: ContactInfoComponent;
  @ViewChild(ContactAddressComponent) contactAddressCmpt: ContactAddressComponent;
  @ViewChild(DxDataGridComponent) gridCustomers: DxDataGridComponent;
  
  customerService: CustomerService;
  userDataSource: any;
  selectedCustomer: Customer;
  dataSource: any;
  userProfile;
  lookupDataSource: any;
  personTypes: any;
  phoneTypes: any;
  gridHeight;
  popupVisible = false;
  leaveWindowOpen = true;

  constructor(globalDataProvider: GlobalDataProvider, customerSvc: CustomerService,
    public authService: AuthenticationService, private globals: Globals) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.customerService = customerSvc;
    this.userDataSource = globalDataProvider.getUsers();
    this.lookupDataSource = globalDataProvider.getLookups();
    // this.userDataSource = globals.userData;
    // this.lookupDataSource = globals.lookupData;
    this.createPersonTypeDataSource();
    this.createPhoneTypeDataSource();
    // this.CreateContactDataSource();
    this.gridHeight = 525;
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
  }
  createPhoneTypeDataSource() {
    this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
  }

  applyChanges() {
    this.customerInfoCmpt.batchSave(this.customer.customer_id).subscribe(res => {
      // console.log('contact-list calling contactsComponent batchSave', res);
      const cnt = this.contactInfoCmpt.batchSave(res);
      const adr = this.contactAddressCmpt.batchSave(res);
        console.log('contactInfo batch Saved Result', cnt);
        console.log('contactAddress batch Saved Result', adr);
          setTimeout(() => {
            // this.gridCustomers.instance.refresh();
            this.customerService.getCustomerData('', res).subscribe(cust => {
              console.log('contact-list applyChanges - selectedCustomer', this.customer);
              console.log('contact-list applyChanges - Customer', cust);
            this.customer = cust;
            });
          }, 1000);
          console.log('Emitting onCustomerSaved', this.customer);
          this.onCustomerSaved.emit(this.leaveWindowOpen);
          // this.orderTabDisabled = false;
          // this.popupVisible = this.leaveWindowOpen;
        });
  }
  cancelChanges() {
    this.onCancel.emit();
  }

  ngOnInit() {
  }

}
