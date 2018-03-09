import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  collapse = true;
  isAdmin = true;
  constructor(public _authService: AuthenticationService, public _router: Router) {
    console.log('User Token', _authService.token);
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('NavBar On Changes');
  }

  logout(): void {
    console.log('logging out');
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
