import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';
import { Shoppinglist } from 'src/app/entities/shoppinglist.model';
import { ShoppinglistService } from './service/shoppinglist.service';
import { User } from 'src/app/entities/user.model';

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

  shoppinglistID: number = -1
  shoppinglistEntries: ShoppinglistEntry[] = []
  
  entryMap: EntryMap = {}

  edit_checked: boolean = false;

  constructor(private router: Router, private shoppinglistService: ShoppinglistService ,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.shoppinglistID = params['id']
      this.loadEntries()
    })
  }

  loadEntries(){
    this.entryMap = {}
      this.shoppinglistService.getShoppinglistEntries(this.shoppinglistID).subscribe((res: any) => {
        for(let entry of res){
          if(entry.assignee){
            this.shoppinglistService.getUserInformationByID(entry.assignee).subscribe((userData: any) => {
              this.entryMap[entry.id] = new Entry(entry.status, entry.name, userData)
            })
          }else{
            this.entryMap[entry.id] = new Entry(entry.status, entry.name, entry.assignee)
          }
        }
      })
  }

  addEntry(){
    const a = 1
  }

  deleteEntry(entryID: number) {
    this.shoppinglistService.deleteEntry(this.shoppinglistID,entryID).subscribe((res:any)=>{
      console.log(res)
      this.loadEntries()
    })
  }

  changeEditBtn(){
    this.edit_checked = !this.edit_checked
  }

  getEntryKeys(obj: EntryMap): any[]{
    return Object.keys(obj)
  }

  getFirstCharFromString(input: string) {
    return Array.from(input)[0]
  }
}
