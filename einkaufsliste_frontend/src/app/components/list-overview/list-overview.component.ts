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
  lists: Shoppinglist[] = [];
  display: boolean = false;
  visibleSidebar: boolean = false;
  friends: User[] = [];
  constructor(
    private router: Router,
    private listOverviewService: ListOverviewService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }
    this.getShoppinglists();
    this.getFriends();
  }

  getShoppinglists() {
    console.log('Einkaufslisten werden geladen');
    this.lists = [];
    this.listOverviewService.getShoppinglists().subscribe((res: any) => {
      this.lists = res;
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
    console.log('Neue Einkaufsliste wird erstellt');
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

  ngOnInit(): void {}

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
        console.log('Einkaufsliste wird gelöscht');
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
}
