import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';
import { ShoppinglistEntry } from 'src/app/entities/shoppinglistEntry.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppinglistService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService) {}

  getShoppinglist(shoppinglistID: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/', { headers: headers });
  }

  deleteShoppinglist(shoppinglistID: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/', { headers: headers });
  }

  getShoppinglistEntries(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglist/' + id + '/entries/', { headers: headers });
  }

  getUserInformation(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/user/information/', { headers: headers });
  }

  addEntry(shoppinglistID: number, val: ShoppinglistEntry): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entry/', val, { headers: headers });
  }

  deleteEntry(shoppinglistID: number, entryID: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entry/' + entryID + '/', { headers: headers });
  }

  changeEntry(shoppinglistID: number, entryID: number, body: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.put(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/entry/' + entryID + '/', body, { headers: headers });
  }

  getContributors(shoppinglistID: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/contributors/', { headers: headers });
  }

  removeContributor(shoppinglistID: number, val: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/contributor/', { body: val, headers: headers });
  }

  addContributor(shoppinglistID: number, val: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/shoppinglist/' + shoppinglistID + '/contributor/', val, { headers: headers });
  }

  getFriendlist(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/friends/', { headers: headers });
  }

  getShoppingplace(lat: number, lng: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/places/shoppingplaces/', { lat: lat, lon: lng }, { headers: headers });
  }
}
