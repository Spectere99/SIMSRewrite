import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  userProfile;
  constructor(authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
  }

  ngOnInit() {
  }

}
