import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
private message: string;
private loginForm;
private loading = false;


  constructor(
        private _router: Router,
        private fb: FormBuilder,
        private _authService: AuthenticationService) {

        console.log('Creating Form');
        this.createForm();
}
    private createForm(): void {
        this.loginForm = this.fb.group({
            userName: ['', [Validators.required]],
            passwordText: ['', Validators.required]
        });
    }

    private submitted() {
        console.log('submitting Login Request', this.loginForm);
        if (this.loginForm.invalid) { return; }

        this.loading = true;
        this._authService.login(this.loginForm.value.userName, this.loginForm.value.passwordText)
            .subscribe(() => {
                this.loading = false;

                const to: string = this._authService.getRedirectUrl() || '/Customer';
                this._router.navigate([to]);
            }, (error) => {
                this.loading = false;
                this.message = error;
                console.error('auth error', error);
            });
    }

  private getHeaders(userId, password) {
      const headers = new Headers({ 'Accept': 'application/json' });
      headers.append('Content-Type', 'application/json; charset=UTF-8');
      headers.append('userid', userId);
      headers.append('password', password);
      // headers.append('showInactive', this.showInactive.toString());
      return headers;
  }

/*   login() {
    console.log('User:', this.userName);
    this._authService.login(this.userName, this.password)
        .subscribe(result => {
            if (result !== undefined && result.length > 0) {
                this.router.navigate(['/Customer']);
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            } else {
                this.loginMsg = 'Username or password is incorrect';
            }
        });
  } */

  ngOnInit() {
    this.message = this._authService.message;
    this._authService.clear();
  }

}
