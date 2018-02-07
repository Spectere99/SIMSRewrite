import { Component, OnInit } from '@angular/core';
// import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from 'angular4-files-upload';


@Component({
  selector: 'app-order-art',
  templateUrl: './order-art.component.html',
  styleUrls: ['./order-art.component.scss']
})
export class OrderArtComponent implements OnInit {

  public selectedFiles;

 /*  private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpg', 'jpeg', 'png'],
    maxFilesCount: 5,
    maxFileSize: 5120000,
    totalFilesSize: 10120000
  }; */

//  constructor(private ng4FilesService: Ng4FilesService) { }
  constructor() { }

/*   filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFiles = selectedFiles.status;
      return;
    }

    this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
  } */
  ngOnInit() {
    // this.ng4FilesService.addConfig(this.testConfig);
  }

}
