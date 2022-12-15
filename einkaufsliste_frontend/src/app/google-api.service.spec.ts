import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment.prod';

import { GoogleApiService } from './google-api.service';

describe('GoogleApiService', () => {
  let service: GoogleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider,
      { provide: 'GOOGLE_API_KEY_CLIENT_ID', useValue: environment.GOOGLE_API_KEY_CLIENT_ID},
      { provide: 'FRONTEND_URL', useValue: environment.FRONTEND_URL },
      { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
    ]
    });
    service = TestBed.inject(GoogleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
