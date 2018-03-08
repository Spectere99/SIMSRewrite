import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
// baseURL = 'http://localhost:56543/api/Security';
userName: string;
password: string;
loginMsg = '';

  constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

  private getHeaders(userId, password) {
      const headers = new Headers({ 'Accept': 'application/json' });
      headers.append('Content-Type', 'application/json; charset=UTF-8');
      headers.append('userid', userId);
      headers.append('password', password);
      // headers.append('showInactive', this.showInactive.toString());
      return headers;
  }
  login() {
    console.log('User:', this.userName);
    this.authenticationService.login(this.userName, this.password)
        .subscribe(result => {
            if (result === true) {
                this.router.navigate(['/']);
            } else {
                this.loginMsg = 'Username or password is incorrect';
            }
        });
  }

  ngOnInit() {
        this.authenticationService.logout();
  }

}
