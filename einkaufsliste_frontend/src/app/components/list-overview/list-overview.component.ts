import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IShoppinglist, Shoppinglist } from 'src/app/entities/shoppinglist.model';
import { ListOverviewService } from './service/list-overview.service';
import { GoogleApiService } from 'src/app/google-api.service';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.css'],
})
export class ListOverviewComponent implements OnInit {
  events: string[] = [];
  opened: boolean = false;
  lists: Shoppinglist[] = [];

  constructor(private router: Router, private listOverviewService: ListOverviewService) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }
    this.listOverviewService.getShoppinglists().subscribe((res: any) => {
      for (let entry of res) {
        this.lists.push(entry);
      }
    });
  }

  ngOnInit(): void {}

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  test() {
    console.log('test');
  }
}
