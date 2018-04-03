import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DevExtremeModule, DxTemplateModule, DxPopupModule,
  DxFilterBuilderModule, DxTextBoxModule, DxSelectBoxModule,
  DxFileUploaderModule } from 'devextreme-angular';
import { MatIconModule, MatSelectModule, MatInputModule, MatButtonModule,
  MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
  MatExpansionModule, MatDialogModule, MatSnackBarModule, MatCardModule,
  MatChipsModule, MatTabsModule} from '@angular/material';

import { ConfirmDialogComponent } from './_shared/confirm/confirm.component';

import { AppComponent } from './app.component';
import { NavbarComponent } from './_shared/navbar/navbar.component';
import { SidenavComponent } from './_shared/sidenav/sidenav.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderComponent } from './order/order.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderInfoComponent } from './order/order-info/order-info.component';
import { TaskComponent } from './task/task.component';
import { GarmentComponent } from './garment/garment.component';
import { ReportComponent } from './report/report.component';
import { LoginComponent } from './login/login.component';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { CustomerContactsComponent } from './customer/customer-contacts/customer-contacts.component';
import { ContactListComponent } from './customer/contact-list/contact-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

import { DatePipe, UpperCasePipe } from '@angular/common';
import { PhoneFormat } from './_shared/pipes/phone.pipe';
import { AddressLookup } from './_shared/pipes/addressType.pipe';
import { ArraySortPipe } from './_shared/pipes/orderBy.pipe';

import { APP_ROUTES } from './app.routes';
import 'devextreme/data/odata/store';
import { OrderArtComponent } from './order/order-art/order-art.component';
import { CustomerOrderListComponent } from './order/customer-order-list/customer-order-list.component';

import { AuthenticationService } from './_services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminComponent } from './admin/admin.component';
import { OrderTaskListComponent } from './order/order-task-list/order-task-list.component';
import { OrderBalanceComponent } from './report/order-balance/order-balance.component';
import { OrderNotesHistoryComponent } from './order/order-notes-history/order-notes-history.component';
import { OrderInvoiceComponent } from './order/order-invoice/order-invoice.component';
import { OrderPaymentsComponent } from './report/order-payments/order-payments.component';
import { OrderSummaryComponent } from './order/order-summary/order-summary.component';

/* const appRoutes: Routes = [
  { path: 'Customer', component: CustomerComponent },
  { path: 'Order', component: OrderComponent },
  { path: 'Task', component: TaskComponent },
  { path: 'Garment', component: GarmentComponent },
  { path: 'Report', component: ReportComponent },
  { path: 'Login', component: LoginComponent },
  { path: '',   redirectTo: '/Login', pathMatch: 'full' },
]; */

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    CustomerComponent,
    OrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderInfoComponent,
    TaskComponent,
    GarmentComponent,
    ReportComponent,
    LoginComponent,
    CustomerInfoComponent,
    CustomerContactsComponent,
    ContactListComponent,
    CustomerListComponent,
    ConfirmDialogComponent,
    PhoneFormat,
    ArraySortPipe,
    AddressLookup,
    OrderArtComponent,
    CustomerOrderListComponent,
    PageNotFoundComponent,
    AdminComponent,
    OrderTaskListComponent,
    OrderBalanceComponent,
    OrderNotesHistoryComponent,
    OrderInvoiceComponent,
    OrderPaymentsComponent,
    OrderSummaryComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    // RouterModule.forRoot(appRoutes),
    RouterModule.forRoot(APP_ROUTES),
    MDBBootstrapModule.forRoot(),
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    DevExtremeModule,
    FormsModule,
    ReactiveFormsModule,
    DxTemplateModule,
    DxSelectBoxModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule
    ],
  providers: [DatePipe, ArraySortPipe, UpperCasePipe, AuthenticationService, AuthGuard],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
