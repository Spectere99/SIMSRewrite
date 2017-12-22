import { Component, OnInit } from '@angular/core';
import { OrderDetail } from '../../_services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})

export class OrderDetailComponent implements OnInit {
itemTypes = [{char_mod: 'polo', description: 'Polo Shirt'}];
styleTypes = [{char_mod: 'Y', description: 'Youth'},
              {char_mod: 'A', description: 'Adult'}];

order: OrderDetail;

  constructor() {
    this.order = new OrderDetail();
    this.order.color = 'Purple';
   }

  ngOnInit() {
  }

}
