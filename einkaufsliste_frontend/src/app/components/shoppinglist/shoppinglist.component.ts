import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';
import { ShoppinglistService } from './service/shoppinglist.service';
import { IUser, User } from 'src/app/entities/user.model';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { IShoppinglist } from 'src/app/entities/shoppinglist.model';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

export class Entry{
  constructor(
    public checked: boolean,
    public name: string,
    public assignee: User
  ){}
}

export interface EntryMap {
  [key: number]: Entry
}

@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css'],
  providers: [ConfirmationService]
})
export class ShoppinglistComponent implements OnInit {

  private routeSub: Subscription = new Subscription;

  shoppinglistEntries: ShoppinglistEntry[] = []
  selectedEntry: ShoppinglistEntry | undefined;
  shoppingList: IShoppinglist | undefined

  signedInUser: User | undefined
  friendlist: User[] = []
  friendlistLight: User[] = []
  selectedFriend: User | undefined

  addEntryName: string = ''
  addEntryAssignee: User | null = <User>{}

  contributorlist: User[] = []
  selectedContributor: User | undefined
  
  entryMap: EntryMap = {}

  edit_checked: boolean = false;

  displayContribAtAssigneeModify: boolean = false
  displayAddEntrySwitch: boolean = false
  displayContribForAddEntry: boolean = false
  dislaySettings: boolean = false
  
  constructor(private router: Router, private shoppinglistService: ShoppinglistService ,private route: ActivatedRoute, private handleError: ErrorHandlerService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.shoppinglistService.getUserInformation().subscribe((user: User) => {
      this.signedInUser = user
      this.loadShoppinglist()
    }, err => {
      this.handleError.handleError(err,window.location.pathname)
    })  
  }

  loadShoppinglist(){
    this.routeSub = this.route.params.subscribe(params => {
      this.shoppinglistService.getShoppinglist(params['id']).subscribe((res:any)=> {
        this.shoppingList = res
        this.shoppingList!.owner = <IUser>{id: res.owner}
        if(this.checkIfSignedInUserIsOwner()){
          this.loadFriends()
        }
        this.loadEntries()
      }, err => {
        this.handleError.handleError(err,window.location.pathname)
      })
    })
  }

  loadEntries(){
    this.shoppinglistEntries = []
      this.shoppinglistService.getShoppinglistEntries(this.shoppingList!.id).subscribe((res: any) => {
        for(let entry of res){
          this.shoppinglistEntries.push(<ShoppinglistEntry>entry)
        }
      }, err => {
        this.handleError.handleError(err,window.location.pathname)
      })
  }

  deleteEntry(entryID: number) {
    this.shoppinglistService.deleteEntry(this.shoppingList!.id,entryID).subscribe((res:any)=>{
      this.loadEntries()
    })
  }

  changeEditBtn(){
    this.edit_checked = !this.edit_checked
  }

  getFirstCharFromString(input: string) {
    return Array.from(input)[0]
  }

  loadContributors(entry?: ShoppinglistEntry) {
    this.selectedEntry = entry ? entry: this.selectedEntry
    this.contributorlist = []
    this.shoppinglistService.getContributors(this.shoppingList!.id).subscribe((contributors: User[])=>{
      for(let contributor of contributors){
        this.contributorlist.push(contributor)
      }
      this.displayContribAtAssigneeModify = entry ? true: this.displayContribAtAssigneeModify
    })
  }

  displayAddEntry(){
    this.displayAddEntrySwitch = true
  }

  modifyEntryAssginee(contributor: number){
    this.displayContribAtAssigneeModify = false
    const entryChanges = {'assignee': contributor!}
    this.shoppinglistService.changeEntry(this.shoppingList!.id,this.selectedEntry!.id!,entryChanges).subscribe(()=>{
      this.loadEntries()
    })
  }

  modifyEntryStatus(entry: ShoppinglistEntry){
    this.selectedEntry = entry
    const entryChanges = {'status': this.selectedEntry!.status, 'assignee': this.selectedEntry!.assignee?.id }
    this.shoppinglistService.changeEntry(this.shoppingList!.id,this.selectedEntry!.id!,entryChanges).subscribe(()=>{
      this.loadEntries()
    })
  }
  
  displayAddEntryAssignee(){
    this.contributorlist = []
    this.shoppinglistService.getContributors(this.shoppingList!.id).subscribe((res: User[])=>{
      for(let contributor of res){
        this.contributorlist.push(contributor)
      }
      this.displayContribForAddEntry = true
    })
  }

  selectUserForAddEntry(conID:number, conUsername: string){
    this.addEntryAssignee = <IUser>{id: conID, username: conUsername}
    this.displayContribForAddEntry = false
  }
  
  addEntry(){
    let newEntry = this.addEntryAssignee!==null ? <ShoppinglistEntry>{'name': this.addEntryName, 'assignee': this.addEntryAssignee!.id} : <ShoppinglistEntry>{'name': this.addEntryName}
    this.shoppinglistService.addEntry(this.shoppingList!.id, newEntry).subscribe((res: any)=>{
      this.addEntryName = ''
      this.addEntryAssignee = <IUser>{}
      this.displayAddEntrySwitch = false
      this.loadEntries()
    })
  }

  openSettings() {
    this.loadContributors()
    this.dislaySettings = true
  }

  checkIfSignedInUserIsOwner(): boolean {
    return this.shoppingList!.owner.id === this.signedInUser!.id
  }

  loadFriends(){
    this.shoppinglistService.getFriendlist().subscribe((friendlist: any[]) => {
      for(let friend of friendlist){
        this.friendlist.push(<IUser>{id: friend.id, username: friend.username})
      }
      console.log(this.friendlist)
    }, err => {
      this.handleError.handleError(err,window.location.pathname)
    })
  }

  removeContributor(contributorId: number){
    const removeContrib = {'contributor': contributorId}
    this.shoppinglistService.removeContributor(this.shoppingList!.id, removeContrib).subscribe(()=>{
      this.loadContributors()
      this.loadEntries()
    }, err => {
      this.handleError.handleError(err,window.location.pathname)
    })
  }

  filterFriend(event: any) {
    let filtered : User[] = []
    let query = event.query;
    for(let i = 0; i < this.friendlist.length; i++) {
        let friend = this.friendlist[i];
        if (friend.username!.toLowerCase().includes(query.toLowerCase()) && this.contributorlist.every(contributor => contributor.id != friend.id)) {
            filtered.push(friend);
        }
    }
    this.friendlistLight = filtered;
  }

  addContributor(){
    const newContributor = {contributor: this.selectedFriend!.id}
    this.shoppinglistService.addContributor(this.shoppingList!.id, newContributor).subscribe(()=>{
      this.loadContributors()
      this.selectedFriend = <IUser>{}
    })
  }

  deleteCurrentShoppinglist(event: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Soll diese Einkaufsliste gelöscht werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Einkaufsliste wird gelöscht');
        this.shoppinglistService.deleteShoppinglist(this.shoppingList!.id).subscribe(()=>{
          this.router.navigate(['list-overview'])
        })
      }
    });

  }
}