import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from 'src/app/google-api.service';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.css']
})
export class ListOverviewComponent implements OnInit {

  constructor(private router: Router,private readonly googleApi: GoogleApiService) {
    console.log(this.isLoggedIn())
    // if (!this.isLoggedIn()){
    //   this.router.navigate(['login'])
    // }
   }

  ngOnInit(): void {
  }

  logout() {
    this.googleApi.signOut()
    this.router.navigate(['login'])
  }

  isLoggedIn(): boolean{
    return this.googleApi.isLoggedIn()
  }

}
