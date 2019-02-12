import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { version, environmentName } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  collapse = true;
  isAdmin = true;
  environmentName = environmentName;
  version = version;
  user;
  constructor(public _authService: AuthenticationService, public _router: Router) {
    const userToken = JSON.parse(_authService.getUserToken());
    if (userToken) {
      this.user = userToken.profile;
    }
    if (userToken) {
      this.isAdmin = userToken.profile.role.indexOf('Security Administrator') !== -1;
      console.log('User Token', userToken);
    }
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('NavBar On Changes');
  }

  logout(): void {
    // console.log('logging out');
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
