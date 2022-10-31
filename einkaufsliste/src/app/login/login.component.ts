import { Component, OnInit } from '@angular/core';
import { GoogleApiService, UserInfo } from '../google-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [GoogleApiService]

})
export class LoginComponent implements OnInit {
  
  constructor(private readonly googleApi: GoogleApiService) {}

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.googleApi.login()
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

}
