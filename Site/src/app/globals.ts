import { Injectable } from '@angular/core';
import { LookupItem } from './_services/lookups.service';
import { User } from './_services/user.service';
import { PriceListItem } from './_services/pricelist.service';

@Injectable()
export class Globals {
    lookupData: Array<LookupItem>;
    userData: Array<User>;
    priceListData: Array<PriceListItem>;
    /* isAdmin = false;
    user = {
        userId: 0,
        userName: '',
        userFullName: '',
        userRole: '',
    }; */
}
