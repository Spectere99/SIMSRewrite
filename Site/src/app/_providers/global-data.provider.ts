import { Injectable } from '@angular/core';
import { LookupItem, LookupService} from '../_services/lookups.service';
import { PriceListItem, PriceListService } from '../_services/pricelist.service';
import { User, UserService } from '../_services/user.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class GlobalDataProvider {
    private lookups: Array<LookupItem>;
    private priceList: Array<PriceListItem>;
    private users: Array<User>;

    constructor(private lookupService: LookupService, private priceListService: PriceListService,
                private userService: UserService) {
    }

    public getLookups(): Array<LookupItem> {
        return this.lookups;
    }

    public getPriceList(): Array<PriceListItem> {
        return this.priceList;
    }

    public getUsers(): Array<User> {
        return this.users;
    }

    load() {
        return new Promise((resolve, reject) => {
            forkJoin(
                this.lookupService.loadLookupData(''), // 0
                this.priceListService.loadPricelistData(''), // 1
                this.userService.getUsers('') // 2
            ).subscribe(res => {
                this.lookups = res[0].value;
                this.priceList = res[1].value;
                this.users = res[2].value;
                resolve(true);
            });
        });
    }
}
