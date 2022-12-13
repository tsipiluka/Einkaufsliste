import { TestBed } from '@angular/core/testing';

import { ValidateInputService } from './validate-input.service';

describe('ValidateInputService', () => {
  let service: ValidateInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
