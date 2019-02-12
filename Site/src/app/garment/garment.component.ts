import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
@Component({
  selector: 'app-garment',
  templateUrl: './garment.component.html',
  styleUrls: ['./garment.component.css']
})
export class GarmentComponent implements OnInit {

  userProfile;
  constructor(authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
  }

  ngOnInit() {
  }

}
