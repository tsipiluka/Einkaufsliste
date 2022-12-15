import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ListOverviewService } from './list-overview.service';

describe('ListOverviewService', () => {
  let service: ListOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ListOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
