import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from 'src/app/google-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,private googleApi: GoogleApiService) { 
    if(localStorage.getItem('access_token')){
      this.router.navigate(['list-overview'])
    }else{
      this.googleApi.checkWithBackend()
    }
  }

  ngOnInit(): void {
  }

  login() {
    this.googleApi.loginWithGoogle()
  }
}
