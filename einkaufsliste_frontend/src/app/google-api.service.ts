import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService} from 'angular-oauth2-oidc'
import { ITokenAuthentication, TokenAuthentication } from './entities/token-authentication.model';
import { LoginService } from './components/login/service/login.service';

const oAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '698434053829-sd79mav27p4ao35kcbm4bar3fjl4cslp.apps.googleusercontent.com',
  scope: 'openid profile email'
}


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private readonly oAuthService: OAuthService, private loginService: LoginService) { 
    oAuthService.configure(oAuthConfig)
    oAuthService.loginUrl = "https://www.google.com/accounts/Logout"
    console.log(oAuthService.getAccessToken())
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()){
          oAuthService.initLoginFlow()
        }else{
          const authenticationData: ITokenAuthentication = {
            token: oAuthService.getAccessToken(),
            backend: 'google-oauth2',
            grant_type: 'convert_token',
            client_id: 'gjS1l709g6TgXEcs9Q9UufRj4gn4f0HVyf9zOv8r',
            client_secret: 'i8MoZaDwzOkUWZ7vZjlXLTXLCMNNOeuTL7B58fTw53RlVj1fYpxeLwJaAYOxRBQqpLgNdABUfbIzMsE3LlnT8Xunn1zJrqEvHnL0CpZzDLYTtrZTepSm7pPYSwfytSTZ'
          }
          console.log('provided Data: '+JSON.stringify(authenticationData))
          this.loginService.loginUser(authenticationData).subscribe((res: any) => {
            console.log("successful: ", res.access_token)
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('refresh_token', res.refresh_token)
          },
          err => {
            console.log(err)
          })
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
