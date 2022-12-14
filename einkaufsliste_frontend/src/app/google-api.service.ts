import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService} from 'angular-oauth2-oidc'
import { ITokenAuthentication, TokenAuthentication } from './entities/token-authentication.model';
import { LoginService } from './components/login/service/login.service';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  oAuthConfig: AuthConfig = {
    issuer: "https://accounts.google.com",
    strictDiscoveryDocumentValidation: false,
    redirectUri: this.frontendUrl + 'login',
    clientId: this.googleApiKeyClientId,
    scope: 'openid profile email'
  }

  constructor(@Inject('GOOGLE_API_KEY_CLIENT_ID') private googleApiKeyClientId: string,
   @Inject('FRONTEND_URL') private frontendUrl: string,

  private router: Router,private readonly oAuthService: OAuthService, private loginService: LoginService) {
    this.oAuthService.configure(this.oAuthConfig)
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.tryLoginImplicitFlow()
    this.checkWithBackend()
  }

  loginWithGoogle() {
    this.oAuthService.configure(this.oAuthConfig)
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.tryLoginImplicitFlow().then(() => {
      if (!this.oAuthService.hasValidAccessToken()){
        this.oAuthService.initLoginFlow()
      }
    })
  }

  checkWithBackend() {
    const authenticationData: ITokenAuthentication = {
      token: this.oAuthService.getAccessToken(),
      backend: 'google-oauth2',
      grant_type: 'convert_token'
    }
    this.loginService.googleLogin(authenticationData).subscribe((res: any) => {
      sessionStorage.clear()
      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
      this.router.navigate(['list-overview'])
    },
    err => {
      console.log(err)
    })
  }
}
