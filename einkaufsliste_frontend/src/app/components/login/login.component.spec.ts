import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers: [OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider, MessageService, ConfirmationService,
        { provide: 'GOOGLE_API_KEY_CLIENT_ID', useValue: environment.GOOGLE_API_KEY_CLIENT_ID},
        { provide: 'FRONTEND_URL', useValue: environment.FRONTEND_URL },
        { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
