import { Component, Input, OnChanges } from '@angular/core';
import { OrderService, OrderArtFile} from '../../_services/order.service';


@Component({
  selector: 'app-order-art',
  templateUrl: './order-art.component.html',
  styleUrls: ['./order-art.component.scss'],
  providers: [OrderService]
})
export class OrderArtComponent {
  @Input() currentOrder: any;
  orderArtFiles: OrderArtFile[] = [];
  value: any[] = [];
  uploadHeaders: any;

  constructor ( public orderService: OrderService ) {

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

    this.orderArtFiles.push(newOrderArtFile);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.value = [];
    console.log('current Order', this.currentOrder);
    this.uploadHeaders = {'orderNumber': this.currentOrder.orderNumber };

    this.orderService.loadOrderArtFileData('', this.currentOrder.order_id).subscribe(res => {
      this.orderArtFiles = res.order_art_file;
      console.log('pulled OrderArt Data', this.orderArtFiles);
    });
  }
}
