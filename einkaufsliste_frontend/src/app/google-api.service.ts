import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService} from 'angular-oauth2-oidc'
import { ITokenAuthentication, TokenAuthentication } from './entities/token-authentication.model';
import { LoginService } from './components/login/service/login.service';
import { Router } from '@angular/router';
import pkg from '../../secrets.json';




const oAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: pkg.GOOGLE_API_KEY_CLIENT_ID,
  scope: 'openid profile email'
}


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private router: Router,private readonly oAuthService: OAuthService, private loginService: LoginService) {
    this.oAuthService.configure(oAuthConfig)
    this.oAuthService.loginUrl = "https://www.google.com/accounts/Logout"
  }

  loginWithGoogle(){
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()){
          this.oAuthService.initLoginFlow()
          this.router.navigate(['/list-overview'])
        }else{
          const authenticationData: ITokenAuthentication = {
            token: this.oAuthService.getAccessToken(),
            backend: 'google-oauth2',
            grant_type: 'convert_token',
            client_id: pkg.CLIENT_ID,
            client_secret: pkg.CLIENT_SECRET
          }
          this.loginService.loginUser(authenticationData).subscribe((res: any) => {
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
