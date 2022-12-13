import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ServerUrlService} from 'src/app/core/server-url/server-url.service';


@Injectable({
  providedIn: 'root',
})
export class ListOverviewService {
  //TODO - change to correct url
  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService:ServerUrlService) {}

  getShoppinglists(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglists/', { headers: headers });
  }

  postShoppinglist(n: string, d: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/shoppinglists/', { name: n, description: d }, { headers: headers });
  }

  deleteShoppinglist(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + id + '/', { headers: headers });
  }

  getPlacesNearby(val: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/google-places/', val);
  }

  getFriendlist(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/friends/', { headers: headers });
  }

  addFriend(username: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.post(this.APIUrl + '/api/friend/' + username + '/', {}, { headers: headers });
  }

  deleteFriend(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/friends/delete/' + id + '/', { headers: headers });
  }

  getUser(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/user/information/', { headers: headers });
  }

  leaveShoppinglist(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.delete(this.APIUrl + '/api/shoppinglist/' + id + '/contribution/', { headers: headers });
  }
}
