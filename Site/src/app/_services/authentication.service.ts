import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    public baseURL = environment.authEndpoint;
    private redirectUrl: string;
    public _isLoggedIn = false;
    public token;
    public message: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        // this.isLoggedIn();
    }

    private getHeaders(userId, password) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        headers.append('password', password);
        // headers.append('showInactive'; this.showInactive.toString());
        return headers;
    }

    login(username: string, password: string): Observable<string> {
        return this.http.post(this.baseURL, null, { headers: this.getHeaders(username, password)})
        .map((response: Response) => {
            console.log('Return from login', response);
            const token = response.json();
            console.log(token);
            if (token) {
                this.token = token;
                sessionStorage.setItem('currentUser', JSON.stringify(token));
                JSON.stringify(token);
            } else {
                return '';
            }
        },
        error => {
            console.log('Error returned', error);
            return '';
        });

        /* return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }); */
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.clear();
    }

    isAuthenticated(): boolean {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log('isAuthenticated - currentUser', currentUser);
         this._isLoggedIn = false;
         if (currentUser) {
            this.token = currentUser.profile;
            this._isLoggedIn = true;
         }
         return this._isLoggedIn;
    }

    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }
    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    public getUserToken(): string {
        return sessionStorage.getItem('currentUser');
    }

    clear(): void {
        console.log('Clearing Local Storage');
        sessionStorage.removeItem('currentUser');
    }
}
