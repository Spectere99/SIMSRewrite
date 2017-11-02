import { Injectable } from '@angular/core';

import { ODataService } from '../_odata/odata.service';
import { RequestTypes } from '../_odata/odata.model';
import { IUrlOptions } from '../_odata/odata.model';

@Injectable()
export class LookupService {

        public requestResult: any;

        constructor(
            private odata: ODataService
        ) { }

        testGet() {
            let urlOptions: IUrlOptions = <IUrlOptions>{};
            urlOptions.restOfUrl = 'LookupItems';
            this.odata.Request(RequestTypes.get, urlOptions).subscribe(
                data => this.requestResult = data,
                error => alert(error)
            );
        }

        testPost() {
            let urlOptions: IUrlOptions = <IUrlOptions>{};
            this.odata.Request(RequestTypes.post, urlOptions).subscribe(
                data => this.requestResult = data,
                error => alert(error)
            );
        }

        testPut() {
            let urlOptions: IUrlOptions = <IUrlOptions>{};
            this.odata.Request(RequestTypes.put, urlOptions).subscribe(
                data => this.requestResult = data,
                error => alert(error)
            );
        }

        testPatch() {
            let urlOptions: IUrlOptions = <IUrlOptions>{};
            this.odata.Request(RequestTypes.patch, urlOptions).subscribe(
                data => this.requestResult = data,
                error => alert(error)
            );
        }

        testDelete() {
            let urlOptions: IUrlOptions = <IUrlOptions>{};
            this.requestResult = this.odata.Request(RequestTypes.delete, urlOptions);
        }

    }
