import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';
import { ShoppinglistService } from './service/shoppinglist.service';
import { User } from 'src/app/entities/user.model';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { IShoppinglist } from 'src/app/entities/shoppinglist.model';

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
  styleUrls: ['./shoppinglist.component.css']
})
export class ShoppinglistComponent implements OnInit {

  private routeSub: Subscription = new Subscription;

  shoppinglistEntries: ShoppinglistEntry[] = []
  selectedEntry: ShoppinglistEntry | undefined;
  shoppingList: IShoppinglist | undefined

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
  
  constructor(private router: Router, private shoppinglistService: ShoppinglistService ,private route: ActivatedRoute, private handleError: ErrorHandlerService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.shoppinglistService.getShoppinglist(params['id']).subscribe((res:IShoppinglist)=> {
        this.shoppingList = res
        this.loadEntries()
      })
    })
  }

  loadEntries(){
    this.shoppinglistEntries = []
      this.shoppinglistService.getShoppinglistEntries(this.shoppingList!.id).subscribe((res: any) => {
        for(let entry of res){
          this.shoppinglistEntries.push(<ShoppinglistEntry>entry)
        }
      }, (err: any) => {
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

  loadContributors(entry: ShoppinglistEntry) {
    this.selectedEntry = entry
    this.contributorlist = []
    this.shoppinglistService.getContributors(this.shoppingList!.id).subscribe((res: User[])=>{
      for(let contributor of res){
        this.contributorlist.push(contributor)
      }
      this.displayContribAtAssigneeModify = true
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
    this.addEntryAssignee = <User>{id: conID, username: conUsername}
    this.displayContribForAddEntry = false
  }
  
  addEntry(){
    let newEntry = this.addEntryAssignee!==null ? <ShoppinglistEntry>{'name': this.addEntryName, 'assignee': this.addEntryAssignee!.id} : <ShoppinglistEntry>{'name': this.addEntryName}
    this.shoppinglistService.addEntry(this.shoppingList!.id, newEntry).subscribe((res: any)=>{
      this.addEntryName = ''
      this.addEntryAssignee = <User>{}
      this.displayAddEntrySwitch = false
      this.loadEntries()
    })
  }

  openSettings() {
    this.dislaySettings = true
  }
}