import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from 'src/app/google-api.service';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.css']
})
export class ListOverviewComponent implements OnInit {

  events: string[] = [];
  opened: boolean = false;

  constructor(private router: Router, ) {
    if(!localStorage.getItem('access_token')){
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }
}