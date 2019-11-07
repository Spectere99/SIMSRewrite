import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler, Injectable, Injector, InjectionToken } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Http, HttpModule, Headers, RequestMethod, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomErrorHandler } from './custom-error-handler';
import { environment, version } from '../environments/environment';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DevExtremeModule, DxTemplateModule, DxPopupModule,
  DxFilterBuilderModule, DxTextBoxModule, DxSelectBoxModule,
  DxFileUploaderModule } from 'devextreme-angular';
import { MatIconModule, MatSelectModule, MatInputModule, MatButtonModule,
  MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
  MatExpansionModule, MatDialogModule, MatSnackBarModule, MatCardModule,
  MatChipsModule, MatTabsModule} from '@angular/material';

import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

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
// import { CustomerContactsComponent } from './customer/customer-contacts/customer-contacts.component';
import { ContactListComponent } from './customer/contact-list/contact-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

import { DatePipe, UpperCasePipe } from '@angular/common';
import { PhoneFormat } from './_shared/pipes/phone.pipe';
import { AddressLookup } from './_shared/pipes/addressType.pipe';
import { ArraySortPipe } from './_shared/pipes/orderBy.pipe';
import { SearchPipe } from './_shared/pipes/search.pipe';

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
import { GarmentListComponent } from './garment/garment-list/garment-list.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { OrderCorrespondenceComponent } from './order/order-correspondence/order-correspondence.component';
import { ContactInfoComponent } from './customer/contact-info/contact-info.component';
import { ContactAddressComponent } from './customer/contact-address/contact-address.component';
import { GlobalDataProvider } from './_providers/global-data.provider';
import { LookupService } from './_services/lookups.service';
import { PriceListService } from './_services/pricelist.service';
import { UserService } from './_services/user.service';
import { WindowRef } from './_services/window-ref.service';
import { OrderQuantitiesComponent } from './report/order-quantities/order-quantities.component';
import { CustomerItemComponent } from './customer/customer-item/customer-item.component';
import * as Sentry from '@sentry/browser';
import * as Raven from 'raven-js';
import { LookupsComponent } from './admin/lookups/lookups.component';
import { LookupListComponent } from './admin/lookups/lookup-list/lookup-list.component';
import { PriceListComponent } from './admin/price-list/price-list.component';
import { PricelistListComponent } from './admin/price-list/pricelist-list/pricelist-list.component';
import { NumberCorrectionComponent } from './admin/number-correction/number-correction.component';
import { NumberListComponent } from './admin/number-correction/number-list/number-list.component';
import { IntegrationComponent } from './admin/integration/integration.component';

/* const appRoutes: Routes = [
  { path: 'Customer', component: CustomerComponent },
  { path: 'Order', component: OrderComponent },
  { path: 'Task', component: TaskComponent },
  { path: 'Garment', component: GarmentComponent },
  { path: 'Report', component: ReportComponent },
  { path: 'Login', component: LoginComponent },
  { path: '',   redirectTo: '/Login', pathMatch: 'full' },
]; */

Sentry.init({
  dsn: 'https://c938625c58394da1910a741f4c48eca8@sentry.io/1378247',
  release: version,
  environment: 'Test'
});

// Raven.config('https://c938625c58394da1910a741f4c48eca8@sentry.io/1378247').install();

/* @Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
} */

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
    // CustomerContactsComponent,
    ContactListComponent,
    CustomerListComponent,
    ConfirmDialogComponent,
    PhoneFormat,
    ArraySortPipe,
    AddressLookup,
    SearchPipe,
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
    GarmentListComponent,
    TaskListComponent,
    OrderCorrespondenceComponent,
    ContactInfoComponent,
    ContactAddressComponent,
    OrderQuantitiesComponent,
    CustomerItemComponent,
    LookupsComponent,
    LookupListComponent,
    PriceListComponent,
    PricelistListComponent,
    NumberCorrectionComponent,
    NumberListComponent,
    IntegrationComponent,
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
    MatTabsModule,
    HttpClientJsonpModule,
    OAuthModule.forRoot()
    ],
  providers: [DatePipe, ArraySortPipe, UpperCasePipe, AuthenticationService, AuthGuard,
              LookupService, PriceListService, UserService, GlobalDataProvider, WindowRef,
              { provide: APP_INITIALIZER, useFactory: globalDataProviderFactory, deps:
                [GlobalDataProvider], multi: true}],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function globalDataProviderFactory(provider: GlobalDataProvider) {
  return () => provider.load();
}
