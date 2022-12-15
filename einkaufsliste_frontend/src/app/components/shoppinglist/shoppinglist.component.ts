import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';
import { ShoppinglistService } from './service/shoppinglist.service';
import { IUser, User } from 'src/app/entities/user.model';
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service';
import { IShoppinglist, Shoppinglist } from 'src/app/entities/shoppinglist.model';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Shoppingplace } from 'src/app/entities/shoppingplace.model';
import { MessageService } from 'primeng/api';
import { FriendlistService } from '../list-overview/friendlist-bar/service/friendlist-api.service';
import { ValidateInputService } from 'src/app/services/validate-input/validate-input.service';

export class Entry {
  constructor(public checked: boolean, public name: string, public assignee: User) {}
}

export interface EntryMap {
  [key: number]: Entry;
}

@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css'],
  providers: [ConfirmationService],
})
export class ShoppinglistComponent implements OnInit {
  private routeSub: Subscription = new Subscription();

  shoppinglistEntries: ShoppinglistEntry[] = [];
  selectedEntry: ShoppinglistEntry | undefined;
  shoppingList: IShoppinglist | undefined;
  shoppingplace = {
    candidates: [] as Shoppingplace[],
  };

  signedInUser: User | undefined;
  friendlist: User[] = [];
  friendlistLight: User[] = [];
  selectedFriend: User | undefined;

  addEntryName: string = '';
  addEntryAssignee: User | null = <User>{};

  contributorlist: User[] = [];
  selectedContributor: User | undefined;

  entryMap: EntryMap = {};

  edit_checked: boolean = false;

  displayContribAtAssigneeModify: boolean = false;
  displayAddEntrySwitch: boolean = false;
  displayContribForAddEntry: boolean = false;
  dislaySettings: boolean = false;
  position: any;

  constructor(
    private router: Router,
    private shoppinglistService: ShoppinglistService,
    private route: ActivatedRoute,
    private handleError: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private friendlistService: FriendlistService,
    private validateInputService: ValidateInputService
  ) {
    this.shoppingplace.candidates = [{ name: '', formatted_address: '' }];
  }

  ngOnInit(): void {
    this.shoppinglistService.getUserInformation().subscribe(
      (user: User) => {
        this.signedInUser = user;
        this.loadShoppinglist();
        this.getShoppingplace();
      },
      err => {
        this.handleError.handleError(err, window.location.pathname);
      }
    );
  }

  loadShoppinglist() {
    this.routeSub = this.route.params.subscribe(params => {
      this.shoppinglistService.getShoppinglist(params['id']).subscribe(
        (res: any) => {
          this.shoppingList = res!;
          this.shoppingList!.owner = <IUser>{ id: res.owner };
          if (this.checkIfSignedInUserIsOwner()) {
            this.loadFriends();
          }
          this.loadEntries();
        },
        err => {
          this.handleError.handleError(err, window.location.pathname);
        }
      );
    });
  }

  loadEntries() {
    this.shoppinglistEntries = [];
    this.shoppinglistService.getShoppinglistEntries(this.shoppingList!.id).subscribe(
      (res: any) => {
        for (let entry of res) {
          this.shoppinglistEntries.push(<ShoppinglistEntry>entry);
        }
      },
      err => {
        this.handleError.handleError(err, window.location.pathname);
      }
    );
  }

  deleteEntry(entryID: number) {
    this.shoppinglistService.deleteEntry(this.shoppingList!.id, entryID).subscribe(
      (res: any) => {
        this.loadEntries();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: this.handleError.handleError(error) + ' - Eintrag konnte nicht gelöscht werden',
        });
      }
    );
  }

  changeEditBtn() {
    this.edit_checked = !this.edit_checked;
  }

  getFirstCharFromString(input: string) {
    return Array.from(input)[0];
  }

  loadContributors(entry?: ShoppinglistEntry) {
    this.selectedEntry = entry ? entry : this.selectedEntry;
    this.contributorlist = [];
    this.shoppinglistService.getContributors(this.shoppingList!.id).subscribe(
      (contributors: User[]) => {
        for (let contributor of contributors) {
          this.contributorlist.push(contributor);
        }
        this.displayContribAtAssigneeModify = entry ? true : this.displayContribAtAssigneeModify;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: this.handleError.handleError(error) + ' - Teilnehmer konnten nicht geladen werden',
        });
      }
    );
  }

  displayAddEntry() {
    this.displayAddEntrySwitch = true;
  }

  modifyEntryAssginee(contributor: number) {
    this.displayContribAtAssigneeModify = false;
    const entryChanges = { assignee: contributor! };
    this.shoppinglistService.changeEntry(this.shoppingList!.id, this.selectedEntry!.id!, entryChanges).subscribe(
      () => {
        this.loadEntries();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: this.handleError.handleError(error) + ' - Teilnehmer konnte nicht geändert werden',
        });
      }
    );
  }

  modifyEntryStatus(entry: ShoppinglistEntry) {
    this.selectedEntry = entry;
    const entryChanges = { status: this.selectedEntry!.status, assignee: this.selectedEntry!.assignee?.id };
    this.shoppinglistService.changeEntry(this.shoppingList!.id, this.selectedEntry!.id!, entryChanges).subscribe(
      () => {
        this.loadEntries();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: this.handleError.handleError(error) + ' - Status konnte nicht geändert werden',
        });
      }
    );
  }

  displayAddEntryAssignee() {
    this.contributorlist = [];
    this.shoppinglistService.getContributors(this.shoppingList!.id).subscribe(
      (res: User[]) => {
        for (let contributor of res) {
          this.contributorlist.push(contributor);
        }
        this.displayContribForAddEntry = true;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: this.handleError.handleError(error) + ' - Teilnehmer konnten nicht geladen werden',
        });
      }
    );
  }

  selectUserForAddEntry(conID: number, conUsername: string) {
    this.addEntryAssignee = <IUser>{ id: conID, username: conUsername };
    this.displayContribForAddEntry = false;
  }

  addEntry() {
    if(this.validateInputService.validateStringInput(this.addEntryName)) {
      let newEntry =
      this.addEntryAssignee !== null
        ? <ShoppinglistEntry>{ name: this.addEntryName, assignee: this.addEntryAssignee!.id }
        : <ShoppinglistEntry>{ name: this.addEntryName };
      this.shoppinglistService.addEntry(this.shoppingList!.id, newEntry).subscribe(
        (res: any) => {
          this.addEntryName = '';
          this.addEntryAssignee = <IUser>{};
          this.displayAddEntrySwitch = false;
          this.loadEntries();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: this.handleError.handleError(error) + ' - Eintrag konnte nicht hinzugefügt werden',
          });
        }
      );
    }else{
      this.showWarnMsg('Bitte geben Sie einen Namen ein');
    }
  }

  showWarnMsg(msg: string) {
    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: msg });
  }

  openSettings() {
    this.loadContributors();
    this.dislaySettings = true;
  }

  checkIfSignedInUserIsOwner(): boolean{
    return this.shoppingList!==undefined ? this.shoppingList.owner.id === this.signedInUser!.id : false;
  }

  loadFriends() {
    this.friendlistService.getFriendlist().subscribe(
      (friendlist: any[]) => {
        for (let friendship of friendlist) {
          if(friendship.friend.id === this.signedInUser!.id){
            this.friendlist.push(<IUser>{ id: friendship.initiator.id, username: friendship.initiator.username });
          } else {
            this.friendlist.push(<IUser>{ id: friendship.friend.id, username: friendship.friend.username });
          }
        }
      },
      err => {
        this.handleError.handleError(err, window.location.pathname);
      }
    );
  }

  removeContributor(event: Event, contributorId: number) {
    const removeContrib = { contributor: contributorId };
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll dieser Teilnehmer entfernt werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Entfernt!', detail: 'Teilnehmer erfolgreich entfernt!' });
        this.shoppinglistService.removeContributor(this.shoppingList!.id, removeContrib).subscribe(
          () => {
            this.loadContributors();
            this.loadEntries();
          },
          err => {
            this.handleError.handleError(err, window.location.pathname);
          }
        );
      },
      reject: () => {
        //reject action
      },
    });
  }

  filterFriend(event: any) {
    let filtered: User[] = [];
    let query = event.query;
    for (let i = 0; i < this.friendlist.length; i++) {
      let friend = this.friendlist[i];
      if (
        friend.username!.toLowerCase().includes(query.toLowerCase()) &&
        this.contributorlist.every(contributor => contributor.id != friend.id)
      ) {
        filtered.push(friend);
      }
    }
    this.friendlistLight = filtered;
  }

  addContributor() {
    const newContributor = { contributor: this.selectedFriend!.id };
    this.shoppinglistService.addContributor(this.shoppingList!.id, newContributor).subscribe(
      () => {
        this.loadContributors();
        this.selectedFriend = <IUser>{};
      },
      (error: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Fehler!',
          detail: this.handleError.handleError(error) + ' - Teilnehmer konnte nicht hinzugefügt werden!',
        });
      }
    );
  }

  deleteCurrentShoppinglist(event: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Einkaufsliste gelöscht werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shoppinglistService.deleteShoppinglist(this.shoppingList!.id).subscribe(
          () => {
            this.router.navigate(['list-overview']);
          },
          (error: any) => {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Fehler!',
              detail: this.handleError.handleError(error) + ' - Einkaufsliste konnte nicht gelöscht werden!',
            });
          }
        );
      },
    });
  }

  getShoppingplace() {
    navigator.geolocation.getCurrentPosition(position => {
      this.position = position;
      this.shoppinglistService.getShoppingplace(this.position.coords.latitude, this.position.coords.longitude).subscribe(
        (res: any) => {
          console.log(res);
          this.shoppingplace.candidates[0].name = res.candidates[0].name;
          this.shoppingplace.candidates[0].formatted_address = res.candidates[0].formatted_address;
        },
        (error: any) => {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Fehler!',
            detail: this.handleError.handleError(error) + ' - Einkaufsplatz konnte nicht gefunden werden!',
          });
        }
      );
    });
  }

  routeToShoppingplace() {
    window.open(
      'https://www.google.com/maps/dir/?api=1&origin=&destination=' +
      this.shoppingplace.candidates[0].name + ' ' + this.shoppingplace.candidates[0].formatted_address + '&travelmode=driving'
    );
  }
}
