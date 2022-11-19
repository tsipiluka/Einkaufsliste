import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {

  //TODO - change to correct url
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient){}

  getShoppinglistEntries(id: number): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglist/'+ id + "/entries/", {'headers': headers} );
  }

  getUserInformationByID(id: number): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/user/information/' + id + '/', {'headers': headers} );
  }

  addEntry(shoppinglistID:number, val: ShoppinglistEntry): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entries/add/',val, {'headers': headers} );
  }

  deleteEntry(shoppinglistID:number, entryID:number): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entry/' + entryID + '/', {'headers': headers} );
  }

  changeEntry(shoppinglistID:number, entryID:number, body: any): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.put(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entry/' + entryID + '/', body,{'headers': headers} );
  }

  getContributors(shoppinglistID:number): Observable<any>{
    const headers= new HttpHeaders()
    .set('Authorization', ''+localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/contributors/', {'headers': headers} );
  }
}