import { Component, OnInit } from '@angular/core';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-order-art',
  templateUrl: './order-art.component.html',
  styleUrls: ['./order-art.component.scss']
})
export class OrderArtComponent {
  value: any[] = [];

  ngOnInit() {

  }
}
