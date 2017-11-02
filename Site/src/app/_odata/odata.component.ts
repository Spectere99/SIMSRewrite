import { Component, OnInit } from '@angular/core';

import { ODataService } from './odata.service';
import { RequestTypes } from './odata.model';
import { IUrlOptions } from './odata.model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'odata',
    templateUrl: 'odata.component.html'
})
export class ODataComponent implements OnInit {

    public requestResult: any;

    constructor(
        private odata: ODataService    ) { }

    ngOnInit() { }

    testGet() {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = 'Tasks';
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
