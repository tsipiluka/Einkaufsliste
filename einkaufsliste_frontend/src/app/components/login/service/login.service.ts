import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';
import { UserLogin } from 'src/app/entities/user-login.model';
import { TokenAuthentication } from '../../../entities/token-authentication.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService){}

  googleLogin(val:TokenAuthentication):Observable<any>{
    return this.http.post(this.APIUrl + 'auth/convert-token', val);
  }

  login(user_credentials: UserLogin): Observable<any>{
    return this.http.post(this.APIUrl + 'auth/token/', user_credentials);
  }
}