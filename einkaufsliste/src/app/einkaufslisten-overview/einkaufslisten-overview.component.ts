import { Component, OnInit } from '@angular/core';
import { GoogleApiService, UserInfo } from '../google-api.service';

@Component({
  selector: 'app-einkaufslisten-overview',
  templateUrl: './einkaufslisten-overview.component.html',
  styleUrls: ['./einkaufslisten-overview.component.css']
})
export class EinkaufslistenOverviewComponent implements OnInit {

  userInfo?: UserInfo

  constructor(private readonly googleApi: GoogleApiService) { }

  ngOnInit(): void {
    this.googleApi.login()
    this.googleApi.userProfileSubject.subscribe(info =>{
      this.userInfo = info
    })
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

}
