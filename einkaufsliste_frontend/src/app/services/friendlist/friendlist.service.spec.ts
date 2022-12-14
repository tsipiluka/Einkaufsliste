import { TestBed } from '@angular/core/testing';

import { FriendlistService } from './friendlist.service';

describe('FriendlistService', () => {
  let service: FriendlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
