import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  collapse = true;
  isAdmin = true;
  constructor(public authService: AuthenticationService) {
    console.log(authService.token);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('NavBar On Changes');
  }

}
