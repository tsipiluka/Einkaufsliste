import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserRegistration } from 'src/app/entities/user-registration.model';
import { GoogleApiService } from 'src/app/google-api.service';
import { ValidateInputService } from 'src/app/services/validate-input/validate-input.service';
import { RegistrationService } from './service/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent{

  email: string | undefined
  username: string | undefined
  new_password1: string | undefined
  new_password2: string | undefined

  constructor(private router: Router,private registrationService: RegistrationService, private googleApiService: GoogleApiService,
    private validateInputService: ValidateInputService, private messageService: MessageService)  { 
    if(localStorage.getItem('access_token')){
      this.router.navigate(['list-overview'])
    }
  }

  showWarnMsg(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: msg });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  googleLogin() {
    this.googleApiService.loginWithGoogle()
  }

  signUp() {
    if(this.validateInputService.validateEmail(this.email!)){
      if(this.validateInputService.validateStringInput(this.username!)){
        if(this.validateInputService.validatePassword(this.new_password1!)){
          if(this.new_password1 === this.new_password2){
            const user_credentials = {... new UserRegistration(this.email!, this.username!, this.new_password1!)}
            this.registrationService.signUpUser(user_credentials).subscribe(async (res: any) => {
              this.showSuccessMsg('Die Registrierung war erfolgreich! Sie werden weitergeleitet')
              localStorage.setItem('access_token', res.access_token)
              localStorage.setItem('refresh_token', res.refresh_token)
              await this.delay(1000)
              this.router.navigate(['list-overview'])
            },
            err => {
              this.showWarnMsg('Die Registrierung ist fehlgeschlagen!')
            })
          }else{
            this.showWarnMsg('Die Passwörter stimmen nicht überein!')
          }
        }else{
          this.showWarnMsg('Bitte geben Sie ein gültiges Passwort ein! mindestens 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Sonderzeichen')
        }
      }else{
        this.showWarnMsg('Bitte geben Sie einen gültigen Benutzernamen ein!')
      }
    }else{
      this.showWarnMsg('Bitte geben Sie eine gültige E-Mail Adresse ein!')
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  redirectToLogin() {
    this.router.navigate(['login'])
  }
}
