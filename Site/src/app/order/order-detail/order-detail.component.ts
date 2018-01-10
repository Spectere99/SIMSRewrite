import { Component, OnInit } from '@angular/core';
import { OrderDetail } from '../../_services/order.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})

export class OrderDetailComponent implements OnInit {
lookupDataSource: Array<LookupItem>;
itemTypes = [{char_mod: 'polo', description: 'Wicking Compression Shirt Short Sleeve'}];
styleTypes: Array<LookupItem>; // = [{char_mod: 'Y', description: 'Youth'},
              // {char_mod: 'A', description: 'Adult'}];
sizeTypes: Array<LookupItem>;
vendorTypes: Array<LookupItem>;

order: OrderDetail;

  constructor(private lookupService: LookupService) {
    this.order = new OrderDetail();
    this.order.color = 'Purple';
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.sizeTypes = this.createLookupTypeSource('ssiz');
      this.styleTypes = this.createLookupTypeSource('sclas');
      this.vendorTypes = this.createLookupTypeSource('vend');
    });
   }

   createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }
  ngOnInit() {
  }

}
