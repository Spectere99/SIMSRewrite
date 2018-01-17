import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {
  lookupDataSource: any;
  phoneTypes: any;
  orderTypes: any;
  statusTypes: any;
  userDataSource: any;

  constructor(lookupService: LookupService, userService: UserService) {
      lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.phoneTypes = this.createLookupTypeSource('PHON');
      this.orderTypes = this.createLookupTypeSource('otyps');
      this.statusTypes = this.createLookupTypeSource('ord');
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });
   }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }
  ngOnInit() {
  }

}
