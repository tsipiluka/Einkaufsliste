import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RegistrationComponent } from './registration.component';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RegistrationComponent],
      providers: [OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider, MessageService, ConfirmationService,
        { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL},
        { provide: 'GOOGLE_API_KEY_CLIENT_ID', useValue: environment.GOOGLE_API_KEY_CLIENT_ID },
        { provide: 'FRONTEND_URL', useValue: environment.FRONTEND_URL }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
