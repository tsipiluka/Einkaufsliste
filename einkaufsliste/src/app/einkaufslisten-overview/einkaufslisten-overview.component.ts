import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleUserInfo } from '../entities/google-user-info.model';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'app-einkaufslisten-overview',
  templateUrl: './einkaufslisten-overview.component.html',
  styleUrls: ['./einkaufslisten-overview.component.css']
})
export class EinkaufslistenOverviewComponent implements OnInit {

  userInfo?: GoogleUserInfo

  constructor(private readonly googleApi: GoogleApiService, private router: Router) { 
    // if(this.isLoggedIn()){
    //   console.log("sind drinnen")
    //   this.googleApi.userProfileSubject.subscribe(info =>{
    //     this.userInfo = info
    //   })
    // }else{
    //   this.router.navigate(['/einkaufslisten-overview'])
    // }
    // this.googleApi.userProfileSubject.subscribe(info =>{
    //   this.userInfo = info
    // })
  }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

}
