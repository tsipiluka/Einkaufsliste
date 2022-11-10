import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService} from 'angular-oauth2-oidc'

const oAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '698434053829-sd79mav27p4ao35kcbm4bar3fjl4cslp.apps.googleusercontent.com',
  scope: 'openid'
}


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private readonly oAuthService: OAuthService) { 
    oAuthService.configure(oAuthConfig)
    oAuthService.loginUrl = "https://www.google.com/accounts/Logout"
    console.log(oAuthService.getAccessToken())
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()){
          oAuthService.initLoginFlow()
        }else{
          console.log('Access Token: '+oAuthService.getAccessToken())
        }
      })
    })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  signOut(){
    return this.oAuthService.logOut()
  }
}
