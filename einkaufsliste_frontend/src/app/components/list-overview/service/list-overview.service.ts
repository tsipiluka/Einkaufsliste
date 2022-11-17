import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListOverviewService {
  //TODO - change to correct url
  readonly APIUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getShoppinglists(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    return this.http.get(this.APIUrl + '/api/shoppinglists/');
  }
}
