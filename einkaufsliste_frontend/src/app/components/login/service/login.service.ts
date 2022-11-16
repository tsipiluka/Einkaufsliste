import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLogin } from 'src/app/entities/user-login.model';
import { TokenAuthentication } from '../../../entities/token-authentication.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //TODO - change to correct url
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient){}

  googleLogin(val:TokenAuthentication):Observable<any>{
    return this.http.post(this.APIUrl + '/auth/convert-token', val);
  }

  login(user_credentials: UserLogin): Observable<any>{
    return this.http.post(this.APIUrl + '/auth/token/', user_credentials);
  }
}