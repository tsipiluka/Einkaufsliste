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
    return this.http.get(this.APIUrl + '/api/shoppinglists/', { headers: headers });
  }

  postShoppinglist(n: string, d: string) {
    const headers = new HttpHeaders().set('Authorization', '' + localStorage.getItem('access_token'));
    const body = JSON.stringify({ name: n, description: d });
    console.log(body);
    this.http.post(this.APIUrl + '/api/shoppinglists/', { name: n, description: d }, { headers: headers }).subscribe({
      next: data => {
        console.log('Success');
      },
      error: error => {
        console.error('There was an error!');
      },
    });
  }
}
