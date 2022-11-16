import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegistration } from 'src/app/entities/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  //TODO - change to correct url
  readonly APIUrl = "http://127.0.0.1:8000";

  constructor(private http: HttpClient){}

  signUpUser(user_credentials: UserRegistration):Observable<any>{
    return this.http.post(this.APIUrl + '/user/create/', user_credentials);
  }

}
