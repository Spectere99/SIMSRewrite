import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DevExtremeModule, DxTemplateModule, DxPopupModule,
  DxFilterBuilderModule, DxTextBoxModule } from 'devextreme-angular';
import { MatIconModule, MatSelectModule, MatInputModule, MatButtonModule,
  MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavbarComponent } from './_shared/navbar/navbar.component';
import { SidenavComponent } from './_shared/sidenav/sidenav.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailsComponent } from './orderDetails/orderDetails.component';
import { TaskComponent } from './task/task.component';
import { GarmentComponent } from './garment/garment.component';
import { ReportComponent } from './report/report.component';
import { LoginComponent } from './login/login.component';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { CustomerContactsComponent } from './customer/customer-contacts/customer-contacts.component';
import { ContactListComponent } from './customer/contact-list/contact-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

const appRoutes: Routes = [
  { path: 'Customer', component: CustomerComponent },
  { path: 'Order', component: OrderComponent },
  { path: 'Task', component: TaskComponent },
  { path: 'Garment', component: GarmentComponent },
  { path: 'Report', component: ReportComponent },
  { path: 'Login', component: LoginComponent },
  { path: '',   redirectTo: '/Login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    CustomerComponent,
    OrderComponent,
    OrderDetailsComponent,
    TaskComponent,
    GarmentComponent,
    ReportComponent,
    LoginComponent,
    CustomerInfoComponent,
    CustomerContactsComponent,
    ContactListComponent,
    CustomerListComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    MDBBootstrapModule.forRoot(),
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    DevExtremeModule,
    FormsModule,
    DxTemplateModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
