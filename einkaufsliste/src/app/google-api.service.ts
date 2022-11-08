import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { GoogleUserInfo } from './entities/google-user-info.model';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '698434053829-sd79mav27p4ao35kcbm4bar3fjl4cslp.apps.googleusercontent.com',
  scope: 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  userProfileSubject = new Subject<GoogleUserInfo>()

  constructor(private readonly oAuthService: OAuthService) {}

   login(): void{
    this.oAuthService.configure(oAuthConfig)
    this.oAuthService.loadDiscoveryDocument().then(()=> {
      this.oAuthService.tryLoginImplicitFlow().then(()=>{
        if(!this.oAuthService.hasValidAccessToken()){
          this.oAuthService.initLoginFlow()
        }else{
          this.oAuthService.loadUserProfile().then((userProfile)=>{
            console.log(JSON.stringify(userProfile))
            this.userProfileSubject.next(userProfile as GoogleUserInfo)
          })
        }
      },
      err => {
        console.log(err)
      })
    })
   }

   isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
   }

   signOut() {
    this.oAuthService.logOut()
   }
}
