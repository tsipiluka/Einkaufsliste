import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleUserInfo } from '../entities/google-user-info.model';
import { GoogleApiService } from '../google-api.service';
import { LoginService } from './service/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [GoogleApiService]

})
export class LoginComponent implements OnInit {

  userInfo?: GoogleUserInfo
  test: any

  //css things
  blurredActive: boolean = false

  constructor(private readonly googleApi: GoogleApiService, private router: Router, private loginService: LoginService ) {}

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.googleApi.login()
    this.googleApi.userProfileSubject.subscribe( info=>{
      this.userInfo = info
      console.log(info)
      this.loginService.loginOrRegisterGoogleUser(info).subscribe((res: any) => {
        this.test = res
      }, 
      err => {
        console.log(err)
      })
    })
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }
  
  logout() {
    this.googleApi.signOut()
  }

}
