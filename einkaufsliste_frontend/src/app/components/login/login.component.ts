import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/entities/user-login.model';
import { GoogleApiService } from 'src/app/google-api.service';
import { LoginService } from './service/login.service';
import { ValidateInputService } from 'src/app/services/validate-input/validate-input.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string | undefined
  password: string | undefined

  constructor(private router: Router,private googleApiService: GoogleApiService, private loginService: LoginService,
    private validateInputService: ValidateInputService,
    private messageService: MessageService,
    @Inject('DJANGO_APP_CLIENT_ID') private djangoAppClientId: string,
    @Inject('DJANGO_APP_CLIENT_SECRET') private djangoAppClientSecret: string,
    ) { 
    if(localStorage.getItem('access_token')){
      this.router.navigate(['list-overview'])
    }else{
      this.googleApiService.checkWithBackend()
    }
  }

  ngOnInit(): void {
  }

  googleLogin() {
    this.googleApiService.loginWithGoogle()
  }

  showWarnMsg(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: msg });
  }

  login(){
    if(this.validateInputService.validateEmail(this.email!)){
      if(this.validateInputService.validatePassword(this.password!)){
        const user_credentials = {... new UserLogin(this.djangoAppClientId,this.djangoAppClientSecret,'password', this.email!, this.password!)}
        this.loginService.login(user_credentials).subscribe((res: any) => {
          localStorage.setItem('access_token', res.access_token)
          localStorage.setItem('refresh_token', res.refresh_token)
          this.router.navigate(['list-overview'])
        }, err=>{
          this.showWarnMsg('Der Account existiert nicht oder das Passwort ist falsch!')
        })
      }else{
        this.showWarnMsg('Bitte geben Sie ein gültiges Passwort ein!\nmindestens 8 Zeichen\n1 Großbuchstabe\n1 Kleinbuchstabe\n1 Sonderzeichen')
      }
    }else{
      this.showWarnMsg('Bitte geben Sie eine gültige E-Mail Adresse ein!')
    }
  }

  redirectToRegister(){
    this.router.navigate(['registration'])
  }
}
