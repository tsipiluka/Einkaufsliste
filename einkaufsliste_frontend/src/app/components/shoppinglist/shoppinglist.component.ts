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

  shoppinglistEntries: ShoppinglistEntry[] = []
  
  entryMap: EntryMap = {}

  checked: boolean = false

  constructor(private router: Router, private shoppinglistService: ShoppinglistService ,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.shoppinglistService.getShoppinglistEntries(params['id']).subscribe((res: any) => {
        for(let entry of res){
          this.entryMap[entry.id] = new Entry(entry.status, entry.name, entry.assignee)
        }
      })
    })
  }

  getEntryKeys(obj: EntryMap): any[]{
    return Object.keys(obj)
  }
}
