import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderComponent } from './order/order.component';
import { TaskComponent } from './task/task.component';
import { GarmentComponent } from './garment/garment.component';
import { ReportComponent } from './report/report.component';
import { AdminComponent } from './admin/admin.component';
import {Routes} from '@angular/router';
import { AuthGuard } from '../app/guards/auth.guard';

export const APP_ROUTES: Routes = [
    { path: 'Login', component: LoginComponent },
    { path: 'Customer', component: CustomerComponent, canActivate: [AuthGuard] },
    { path: 'Order', component: OrderComponent, canActivate: [AuthGuard] },
    { path: 'Task', component: TaskComponent, canActivate: [AuthGuard] },
    { path: 'Garment', component: GarmentComponent, canActivate: [AuthGuard] },
    { path: 'Report', component: ReportComponent, canActivate: [AuthGuard] },
    { path: 'Admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'Customer', pathMatch: 'full'},
    { path: '**', component: PageNotFoundComponent }
];
