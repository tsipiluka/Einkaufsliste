import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';
import { FriendlistService } from '../service/friendlist-api.service';

@Component({
  selector: 'app-friendlist-bar',
  templateUrl: './friendlist-bar.component.html',
  styleUrls: ['./friendlist-bar.component.css']
})
export class FriendlistBarComponent implements OnInit {

  // friendRequests: any[] = [];
  acceptedFriends: any[] = [];
  pendingFriends: any[] = [];
  friendname: string | undefined;

  @Input() friendRequests: any[] = [];
  @Input() user: any | undefined

  constructor(private friendlistService: FriendlistService, private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getAcceptedFriends();
  }

  validateStringInput(str: string) {
    return str !== '' && str !== undefined && str !== null;
  }

  addFriend() {
    if(this.validateStringInput(this.friendname!)){
      this.friendlistService.addFriend(this.friendname!).subscribe(
        (res: any) => {
          this.getPendingFriends();
          this.friendname = undefined;
        },
        (err: any) => {
          this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Freund konnte nicht hinzugefügt werden!')
        }
      );
    }else{
      this.showWarnMsg('Bitte geben Sie den Namen ihres Freundes an!')
    }
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

  getAcceptedFriends() {
    this.friendlistService.getFriendlist().subscribe(
      (res: any) => {
        this.acceptedFriends = res;
        this.getPendingFriends();
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err)+' - Freundesliste konnte nicht geladen werden!')
      }
    );
    this.acceptedFriends = [...this.acceptedFriends];
  }

  getPendingFriends() {
    this.friendlistService.getPendingFriendlist().subscribe(
      (res: any) => {
        this.pendingFriends = res;
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err)+' - Austehende Freundschaftsanfragen konnte nicht geladen werden!')
      }
    );
    this.pendingFriends = [...this.pendingFriends];
  }

  getFriendRequests(){
    this.friendlistService.getFriendRequests().subscribe(
      (res: any) => {
        this.friendRequests = res;
        this.getAcceptedFriends()
      },
      (err: any) => {
        this.showErrorMsg(this.errorHandlerService.handleError(err)+' - Freundschaftsanfragen an Sie konnten nicht geladen werden!')
      }
    );
    this.friendRequests = [...this.friendRequests!];
  }

  deleteFriend(event: Event, id: number, trigger: string) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll dieser Freund entfernt werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Entfernt!', detail: 'Freund erfolgreich entfernt!' });
        this.friendlistService.deleteFriend(id).subscribe(
          (res: any) => {
            switch (trigger) {
              case 'accepted':
                this.getAcceptedFriends();
                break;
              case 'pending':
                this.getPendingFriends();
                break;
              case 'request':
                this.getFriendRequests();
                break;
            }
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
  
  acceptRequest(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Freundschaftsanfrage akzeptiert werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Akzeptiert!', detail: 'Freundschaftsanfrage erfolgreich akzeptiert!' });
        this.friendlistService.acceptFriendRequest(id).subscribe(
          (res: any) => {
            this.getFriendRequests();
            this.getAcceptedFriends();
          },
          err => {
            this.showErrorMsg(this.errorHandlerService.handleError(err) + ' - Freundschaftsanfrage konnte nicht akzeptiert werden!')
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }
}
