import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
baseURL = 'http://localhost:56543/api/Security';
userName: string;
password: string;
loginMsg = '';

  constructor(private http: Http, private router: Router) { }

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
      return this.http.get(this.baseURL, {headers: this.getHeaders(this.userName, this.password)})
      .subscribe(res => {
          console.log('Return from login', res);
          /* this.profile = res.json();
          console.log('converted to profile', this.profile); */
          this.loginMsg = '';
          localStorage.setItem('userProfile', res.json());
          this.router.navigateByUrl('Customer');
          // return res.json();
      },
      error => {
          console.log('invalid login');
          this.loginMsg = 'Invalid Login or Password.  Please try again.';
      });
  }

  ngOnInit() {
  }

}
