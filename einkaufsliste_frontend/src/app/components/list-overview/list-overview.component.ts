import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IShoppinglist, Shoppinglist } from 'src/app/entities/shoppinglist.model';
import { ListOverviewService } from './service/list-overview.service';
import { GoogleApiService } from 'src/app/google-api.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/entities/user.model';

@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ListOverviewComponent implements OnInit {
  events: string[] = [];
  opened: boolean = false;
  lists: any[] = [];
  display: boolean = false;
  visibleSidebar: boolean = false;
  friends: User[] = [];
  user: User = new User(0, '', '', '', new Date(), '');

  constructor(
    private router: Router,
    private listOverviewService: ListOverviewService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }
    this.getUser();
    this.getShoppinglists();
    this.getFriends();
  }

  getUser() {
    this.listOverviewService.getUser().subscribe((res: any) => {
      this.user = res;
    });
  }

  getShoppinglists() {
    this.lists = [];
    this.listOverviewService.getShoppinglists().subscribe((res: any) => {
      this.lists = res;
      console.log(this.lists[0].owner);
    });
  }

  addFriend() {
    this.listOverviewService.addFriend((<HTMLInputElement>document.getElementById('friendname')).value).subscribe((res: any) => {
      this.getFriends();
      (<HTMLInputElement>document.getElementById('friendname')).value = '';
    });
  }

  getFriends() {
    this.listOverviewService.getFriendlist().subscribe((res: any) => {
      this.friends = res;
    });
    this.friends = this.friends;
  }

  createShoppinglist() {
    this.listOverviewService
      .postShoppinglist(
        (<HTMLInputElement>document.getElementById('name')).value,
        (<HTMLInputElement>document.getElementById('description')).value
      )
      .subscribe((res: any) => {
        this.getShoppinglists();
        this.display = false;
      });
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Erfolgreich!', detail: 'Einkaufsliste erfolgreich erstellt!' });
  }

  ngOnInit(): void {
    this.getStoresNearby();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  showDialog() {
    this.display = true;
  }

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Einkaufsliste gelöscht werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Gelöscht!', detail: 'Einkaufsliste erfolgreich gelöscht!' });
        this.listOverviewService.deleteShoppinglist(id).subscribe((res: any) => {
          this.getShoppinglists();
        });
      },
      reject: () => {
        //reject action
      },
    });
  }

  toShoppinglist(id: number) {
    this.router.navigate(['shoppinglist', id]);
  }

  getStoresNearby() {
    if (!navigator.geolocation) {
    }
    navigator.geolocation.getCurrentPosition(position => {
      const coords = position.coords;
      const latLong = { lat: coords.latitude, log: coords.longitude };
    });
  }

  routeToGmap() {
    this.router.navigate(['gmap']);
  }

  deleteFriend(id: number) {
    this.listOverviewService.deleteFriend(id).subscribe((res: any) => {
      this.getFriends();
    });
  }
}
