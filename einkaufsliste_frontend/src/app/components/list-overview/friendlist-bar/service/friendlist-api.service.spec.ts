import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FriendlistService } from './friendlist-api.service';

describe('FriendlistService', () => {
  let service: FriendlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FriendlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
