import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  userProfile;
  constructor(authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
  }

  ngOnInit() {
  }

}
