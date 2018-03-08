import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    public baseURL = environment.authEndpoint;
    public token;
    constructor(private http: Http) {
        // set token if saved in local storage
         const currentUser = JSON.parse(localStorage.getItem('currentUser'));
         if (currentUser) {
            this.token = currentUser.profile;
         }
    }

    private getHeaders(userId, password) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        headers.append('password', password);
        // headers.append('showInactive'; this.showInactive.toString());
        return headers;
    }
    login(username: string, password: string): Observable<boolean> {

        return this.http.post(this.baseURL, null, { headers: this.getHeaders(username, password)})
        .map((response: Response) => {
            console.log('Return from login', response);
            const token = response.json();
            console.log(token);
            if (token) {
                this.token = token;
                localStorage.setItem('currentUser', JSON.stringify(token));
                return true;
            } else {
                return false;
            }
        },
        error => {
            console.log('Error returned', error);
            return false;
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
        localStorage.removeItem('currentUser');
    }
}
