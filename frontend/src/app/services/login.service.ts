import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenAuthentication } from '../entities/token-authentication.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO - change to correct url
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient){}

  loginUser(val:TokenAuthentication):Observable<any>{
    const headers = new HttpHeaders();
    return this.http.post(this.APIUrl + '/auth/convert-token', val);
  }

  //TODO - create service for normal user login
}