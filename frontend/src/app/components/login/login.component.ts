import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from 'src/app/google-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,private readonly googleApi: GoogleApiService) { 
    console.log(this.isLoggedIn())
    if (this.isLoggedIn()){
      this.router.navigate(['/list-overview'])
    }
  }

  ngOnInit(): void {
  }

  login() {
    this.googleApi.loginWithGoogle()
  }

  isLoggedIn(): boolean{
    return this.googleApi.isLoggedIn()
  }
}
