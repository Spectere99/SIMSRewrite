import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
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
    private baseURL = 'http://localhost:56543/odata';
    public requestResult: Array<any>;

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }
    loadLookupData(userId): Observable<any> {
        return this.http.get(this.baseURL + '/LookupItems', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    getPhoneTypes(): Array<LookupItem> {
        const returnPhoneTypes = [{
            id: 59,
            className: 'PHON',
            chr_mod: 'hphon',
            description: 'Home Phone'
        },
        {
            id: 60,
            className: 'PHON',
            chr_mod: 'wphon',
            description: 'Work Phone'
        },
        {
            id: 61,
            className: 'PHON',
            chr_mod: 'cphon',
            description: 'Cell Phone'
        }];

        return returnPhoneTypes;
    }

    getPersonTypes(): Array<LookupItem> {
    const returnPersonTypes = [{
        id:85,
        className: 'CONT',
        chr_mod: 'prime',
        description: 'Primary'
    },
    {
        id: 74,
        className: 'CONT',
        chr_mod: 'sec',
        description: 'Secondary'
    }];

    return returnPersonTypes;
}}
