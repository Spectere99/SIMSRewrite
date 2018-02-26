import { Component, Input, OnChanges } from '@angular/core';
import { OrderService, OrderArtFile } from '../../_services/order.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-art',
  templateUrl: './order-art.component.html',
  styleUrls: ['./order-art.component.scss'],
  providers: [OrderService]
})
export class OrderArtComponent {
  @Input() currentOrder: any;
  // orderUploadURL = 'http://localhost:56543/api/ArtFile';
  // orderUploadURL = 'http://localhost:8888/api/ArtFile';
  orderUploadURL = environment.artUploadURL;
  // defaultArtFolder = 'http://localhost:56543/orderimage/';
  // defaultArtFolder = 'http://localhost:8888/orderimage/';
  defaultArtFolder = environment.defaultArtFolder;
  orderArtFiles: OrderArtFile[] = [];
  value: any[] = [];
  uploadHeaders: any;

  constructor(public orderService: OrderService) {

  }

  uploadComplete(e) {
    console.log('Upload Complete!', e);
    const newOrderArtFile: OrderArtFile = {
      order_art_id: 0,
      order_id: this.currentOrder.order_id,
      art_folder: '',
      note: '',
      image_file: e.file.name,
      order_by: this.orderArtFiles.length + 1
    };
    // console.log('newOrderArtFile', newOrderArtFile);
    this.orderArtFiles.push(newOrderArtFile);
    // console.log('After orderArtFiles.push');
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.value = [];
    // console.log('order-art-component current Order', this.currentOrder);
    if (this.currentOrder.order_id !== 0) {
      this.uploadHeaders = { 'orderNumber': this.currentOrder.orderNumber };

      this.orderService.loadOrderArtFileData('', this.currentOrder.order_id).subscribe(res => {
        this.orderArtFiles = res.order_art_file;

        // console.log('pulled OrderArt Data', this.orderArtFiles);
      });
    } else {
      this.orderArtFiles = new Array<OrderArtFile>();
    }
  }
}
