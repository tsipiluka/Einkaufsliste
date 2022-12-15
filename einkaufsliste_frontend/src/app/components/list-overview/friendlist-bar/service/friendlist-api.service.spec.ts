import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment.prod';

import { FriendlistService } from './friendlist-api.service';

describe('FriendlistService', () => {
  let service: FriendlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
      ]
    });
    service = TestBed.inject(FriendlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
