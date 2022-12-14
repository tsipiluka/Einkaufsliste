import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListOverviewService } from './service/list-overview.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/entities/user.model';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';
import { FriendlistService } from 'src/app/services/friendlist/friendlist.service';

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

  name: string | undefined;
  description: string | undefined;

  constructor(
    private router: Router,
    private listOverviewService: ListOverviewService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService,
    private friendlistService: FriendlistService
  ) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }else{
      this.getUser();
      this.getShoppinglists();
      this.getFriends();
    }
  }

  getUser() {
    this.listOverviewService.getUser().subscribe(
      (res: any) => {
        this.user = res;
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Benutzer konnten nicht geladen werden!')
      }
    );
  }

  getShoppinglists() {
    this.lists = [];
    this.listOverviewService.getShoppinglists().subscribe(
      (res: any) => {
        this.lists = res;
        console.log(this.lists[0].owner);
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Einkaufslisten konnten nicht geladen werden!')
      }
    );
  }

  addFriend() {
    this.friendlistService.addFriend((<HTMLInputElement>document.getElementById('friendname')).value).subscribe(
      (res: any) => {
        this.getFriends();
        (<HTMLInputElement>document.getElementById('friendname')).value = '';
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Freund konnte nicht hinzugefügt werden!')
      }
    );
  }

  getFriends() {
    this.friendlistService.getFriendlist().subscribe(
      (res: any) => {
        this.friends = res;
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err)+' - Freundesliste konnte nicht geladen werden!')
      }
    );
    this.friends = this.friends;
  }

  createShoppinglist() {
    if(this.validateStringInput(this.name!)){
      if(this.validateStringInput(this.description!)){
        const new_shoppinglist = {name: this.name, description: this.description}
        this.listOverviewService
          .postShoppinglist(new_shoppinglist)
          .subscribe(
            (res: any) => {
              this.getShoppinglists();
              this.display = false;
              this.showSuccessMsg('Einkaufsliste erfolgreich erstellt!')
            },
            err => {
              this.showErrorMsg(this.errorHandlerService.handleError(err)+' - Einkaufsliste konnte nicht erstellt werden!')
            }
          );
      }else{
        this.showWarnMsg('Bitte geben Sie eine Beschreibung ein!')
      }
    }else{
      this.showWarnMsg('Bitte geben Sie einen Namen ein!')
    }
  }

  ngOnInit(): void {}

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  validateStringInput(str: string) {
    return str !== '' && str !== undefined && str !== null;
  }

  showDialog() {
    this.display = true;
  }

  showErrorMsg(msg: string) {
    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: 'Fehler!',
      detail: msg,
    });
  }

  showWarnMsg(msg: string) {
    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: msg });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: msg });
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Einkaufsliste gelöscht werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Gelöscht!', detail: 'Einkaufsliste erfolgreich gelöscht!' });
        this.listOverviewService.deleteShoppinglist(id).subscribe(
          (res: any) => {
            this.getShoppinglists();
          },
          (err: any) => {
            this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Einkaufsliste konnte nicht gelöscht werden!')
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }

  confirmLeave(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Einkaufsliste verlassen werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Verlassen!', detail: 'Einkaufsliste erfolgreich verlassen!' });
        this.listOverviewService.leaveShoppinglist(id).subscribe(
          (res: any) => {
            this.getShoppinglists();
          },
          (err: any) => {
            this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Einkaufsliste konnte nicht verlassen werden!')
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }

  toShoppinglist(id: number) {
    this.router.navigate(['shoppinglist', id]);
  }

  deleteFriend(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll dieser Freund entfernt werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Entfernt!', detail: 'Freund erfolgreich entfernt!' });
        this.friendlistService.deleteFriend(id).subscribe(
          (res: any) => {
            this.getFriends();
          },
          err => {
            this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Freund konnte nicht entfernt werden!')
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }
}
