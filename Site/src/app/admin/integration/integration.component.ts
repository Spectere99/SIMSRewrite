import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Headers, Response } from '@angular/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { OAuthClient } from 'intuit-oauth';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  private baseURL = environment.integrationEndpoint;
  public options: string;

  oAuthClient;
  constructor(private http: Http) {
    /* oAuthClient = {
      clientId: '',
      clientSecret: '',
      environment: 'sandbox' || 'production',
      redirectUri: '',
      logging: true,
    }; */
  }

  private getHeaders() {
    const headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    //headers.append('userid', userId);
    // headers.append('showInactive'; this.showInactive.toString());
    return headers;
}
  runIntegration() {
    console.log('running Integration');
    const authUri = this.oAuthClient.authorizeUri({scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testState'});

    console.log('AuthURI', authUri);
    // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
    /* return this.http.post(this.baseURL, undefined, {headers: this.getHeaders() })
        .subscribe((res: Response) => {
            console.log(res.json());
            window.open(res.json());
            // return res.json();
        }); */
  }
  ngOnInit() {
  }

}
