import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleUserInfo } from 'src/app/entities/google-user-info.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO - change to correct url
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient){}

  loginOrRegisterGoogleUser(val:GoogleUserInfo):Observable<any>{
    return this.http.post(this.APIUrl + '/google-user-info/', val);
  }

  //TODO - create service for normal user login
}
