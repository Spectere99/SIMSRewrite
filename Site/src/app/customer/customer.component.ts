import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { LookupService } from '../_services/lookups.service';
import { UserService } from '../_services/user.service';
import { CustomerContactsComponent } from './customer-contacts/customer-contacts.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild('customerTabs') tabs: NgbTabset;

  ngOnInit() {
  }

}
