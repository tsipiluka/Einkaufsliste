import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/core/server-url/server-url.service';
import { UserRegistration } from 'src/app/entities/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  readonly APIUrl = this.serverUrlService.getAPIUrl();

  constructor(private http: HttpClient, private serverUrlService: ServerUrlService){}

  signUpUser(user_credentials: UserRegistration):Observable<any>{
    return this.http.post(this.APIUrl + '/user/create/', user_credentials);
  }

}
