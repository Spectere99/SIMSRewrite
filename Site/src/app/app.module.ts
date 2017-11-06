import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Http, HttpModule, Headers, RequestMethod, RequestOptions } from '@angular/http';

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

import { DevExtremeModule } from 'devextreme-angular';

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
    LoginComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    HttpModule,
    BrowserModule,
    DevExtremeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
