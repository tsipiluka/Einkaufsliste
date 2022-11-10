import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from './google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private router: Router,private readonly googleApi: GoogleApiService){}

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  signOut() {
    this.googleApi.signOut()
    this.router.navigate(['/'])
  }

  
}
