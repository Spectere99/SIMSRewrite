import { Component } from '@angular/core';
import { Globals } from './globals';
import { LookupService } from './_services/lookups.service';
import { UserService, User } from './_services/user.service';
import { PriceListService } from './_services/pricelist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals, LookupService, UserService, PriceListService]
})
export class AppComponent {
  title = 'app';

  constructor() {}
 /*  constructor(private globals: Globals, private lookupService: LookupService, private userService: UserService,
             private priceListService: PriceListService) {

    console.log('app-component: constructor loading global lists');
    this.userService.getUsers('rwflowers').subscribe(res => {
      globals.userData = res.value;
      console.log('app-component: constructor userData values', this.globals.userData);
    });
    this.lookupService.loadLookupData('rwflowers').subscribe(res => {
      globals.lookupData = res.value;
      console.log('app-component: constructor lookupData values', this.globals.lookupData);
    });
    this.priceListService.loadPricelistData('').subscribe(res => {
      globals.priceListData = res.value;
    });
   } */
}
