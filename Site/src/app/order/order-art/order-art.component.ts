import { Component, Input, OnChanges } from '@angular/core';
import { OrderService, OrderArtFile } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
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
  userProfile;

  constructor(public orderService: OrderService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
  }

  uploadComplete(e) {
    console.log('Upload Complete!', e);
    const newOrderArtFile: OrderArtFile = {
      order_art_id: (this.orderArtFiles.length + 1) * -1,
      order_id: this.currentOrder.order_id,
      art_folder: '',
      note: '',
      image_file: e.file.name,
      order_by: this.orderArtFiles.length + 1
    };
    console.log('newOrderArtFile', newOrderArtFile);
    this.orderService.updateOrderArtFile('', newOrderArtFile).subscribe(res => {
      console.log('Response', res);
      newOrderArtFile.order_art_id = res.order_art_id;
      console.log('newOrderArtFile', newOrderArtFile);
      this.orderArtFiles.push(newOrderArtFile);
      });
    // console.log('After orderArtFiles.push');
  }

  batchSave(order_id: number) {
    for (let x = 0; x < this.orderArtFiles.length; x++) {
      this.orderArtFiles[x].order_id = order_id;
      this.saveArtItem(this.orderArtFiles[x]);
    }
  }

  saveArtItem(artItem: OrderArtFile) {
    this.orderService.updateOrderArtFile('', artItem).subscribe(res => {
      console.log('Response', res);
      artItem.order_art_id = res.order_art_id;
    });
  }

  deleteArtItem(e) {
    console.log('deletingArtItem', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderArtFiles.findIndex(x => x.order_art_id === e.order_art_id);
    console.log('Del Art Item', index);
    if (index >= 0) {
      this.orderService.deleteOrderArtFile('', e.order_art_id).subscribe(res => {
        this.orderArtFiles.splice(index, 1);
      });
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.value = [];
    // console.log('order-art-component current Order', this.currentOrder);
    if (this.currentOrder.order_id !== 0) {
      this.uploadHeaders = { 'orderNumber': this.currentOrder.orderNumber };

      this.orderService.loadOrderArtFileData('', this.currentOrder.order_id).subscribe(res => {
        this.orderArtFiles = res.order_art_file;

        console.log('pulled OrderArt Data', this.orderArtFiles);
      });
    } else {
      this.orderArtFiles = new Array<OrderArtFile>();
    }
  }
}
