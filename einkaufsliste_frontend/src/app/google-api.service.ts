import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService} from 'angular-oauth2-oidc'
import { ITokenAuthentication, TokenAuthentication } from './entities/token-authentication.model';
import { LoginService } from './components/login/service/login.service';
import { Router } from '@angular/router'
import pkg from '../../secrets.json';

const oAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  redirectUri: "http://localhost:4200/login",
  clientId: pkg.GOOGLE_API_KEY_CLIENT_ID,
  scope: 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private router: Router,private readonly oAuthService: OAuthService, private loginService: LoginService) {
    this.oAuthService.configure(oAuthConfig)
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.tryLoginImplicitFlow()
    this.checkWithBackend()
  }

  loginWithGoogle() {
    this.oAuthService.configure(oAuthConfig)
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
      grant_type: 'convert_token',
      client_id: pkg.CLIENT_ID,
      client_secret: pkg.CLIENT_SECRET
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
