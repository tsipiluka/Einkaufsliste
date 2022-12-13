import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListOverviewService } from './service/list-overview.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/entities/user.model';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';

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
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService
  ) {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['login']);
    }
    this.getUser();
    this.getShoppinglists();
    this.getFriends();
  }

  getUser() {
    this.listOverviewService.getUser().subscribe(
      (res: any) => {
        this.user = res;
      },
      (error: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Fehler!',
          detail: this.errorHandlerService.handleError(error) + ' - Benutzer konnten nicht geladen werden!',
        });
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
      (error: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Fehler!',
          detail: this.errorHandlerService.handleError(error) + ' - Einkaufslisten konnten nicht geladen werden!',
        });
      }
    );
  }

  addFriend() {
    this.listOverviewService.addFriend((<HTMLInputElement>document.getElementById('friendname')).value).subscribe(
      (res: any) => {
        this.getFriends();
        (<HTMLInputElement>document.getElementById('friendname')).value = '';
      },
      (error: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Fehler!',
          detail: this.errorHandlerService.handleError(error) + ' - Freund konnte nicht hinzugefügt werden!',
        });
      }
    );
  }

  getFriends() {
    this.listOverviewService.getFriendlist().subscribe(
      (res: any) => {
        this.friends = res;
      },
      (error: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Fehler!',
          detail: this.errorHandlerService.handleError(error) + ' - Freundesliste konnte nicht geladen werden!',
        });
      }
    );
    this.friends = this.friends;
  }

  createShoppinglist() {
    this.listOverviewService
      .postShoppinglist(
        (<HTMLInputElement>document.getElementById('name')).value,
        (<HTMLInputElement>document.getElementById('description')).value
      )
      .subscribe(
        (res: any) => {
          this.getShoppinglists();
          this.display = false;
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Erfolgreich!',
            detail: 'Einkaufsliste erfolgreich erstellt!',
          });
        },
        (error: any) => {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Fehler!',
            detail: this.errorHandlerService.handleError(error) + ' - Einkaufsliste konnte nicht erstellt werden!',
          });
        }
      );
  }

  ngOnInit(): void {}

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  showDialog() {
    this.display = true;
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
          (error: any) => {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Fehler!',
              detail: this.errorHandlerService.handleError(error) + ' - Einkaufsliste konnte nicht gelöscht werden!',
            });
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
          (error: any) => {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Fehler!',
              detail: this.errorHandlerService.handleError(error) + ' - Einkaufsliste konnte nicht verlassen werden!',
            });
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
        this.listOverviewService.deleteFriend(id).subscribe(
          (res: any) => {
            this.getFriends();
          },
          error => {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Fehler!',
              detail: this.errorHandlerService.handleError(error) + ' - Freund konnte nicht entfernt werden!',
            });
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }
}
