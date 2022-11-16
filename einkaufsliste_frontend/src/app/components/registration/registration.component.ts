import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistration } from 'src/app/entities/user-registration.model';
import { RegistrationService } from './service/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  email: string = ''
  username: string = ''
  password: string = ''

  constructor(private router: Router,private registrationService: RegistrationService) { }

  ngOnInit(): void {
  }

  signUp() {
    const user_credentials = {... new UserRegistration(this.email, this.username, this.password)}
    this.registrationService.signUpUser(user_credentials).subscribe((res: any) => {
      // localStorage.setItem('access_token', res.access_token)
      // localStorage.setItem('refresh_token', res.refresh_token)
      // this.router.navigate(['list-overview'])
      this.router.navigate(['login'])
    },
    err => {
      console.log(err)
    })
  }
}
