import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entities/user-login.model';
import { GoogleApiService } from 'src/app/google-api.service';
import { LoginService } from './service/login.service';
import pkg from '../../../../secrets.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''

  constructor(private router: Router,private googleApi: GoogleApiService, private loginService: LoginService) { 
    if(localStorage.getItem('access_token')){
      this.router.navigate(['list-overview'])
    }else{
      this.googleApi.checkWithBackend()
    }
  }

  ngOnInit(): void {
  }

  googleLogin() {
    this.googleApi.loginWithGoogle()
  }

  login(){
    const user_credentials = {... new UserLogin(pkg.CLIENT_ID,pkg.CLIENT_SECRET,'password', this.email, this.password)}
    this.loginService.login(user_credentials).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
      this.router.navigate(['list-overview'])
    })
  }

  showResponse(event: any) {
    console.log(event)
  }
}
