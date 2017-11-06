import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ODataService } from '../_odata/odata.service';
import { RequestTypes } from '../_odata/odata.model';
import { IUrlOptions } from '../_odata/odata.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class LookupItem {
    id: number;
    className: string;
    chr_mod: string;
    description: string;
}

@Injectable()
export class LookupService {
    lookupService: ODataService;
    public requestResult: any;

    constructor( private odata: ODataService ) { }

    Get(className: string) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = 'Tasks';
        this.odata.Request(RequestTypes.get, urlOptions).subscribe(
            data => this.requestResult = data,
            error => alert(error)
        );
    }
}
