import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment.prod';

import { ListOverviewService } from './list-overview.service';

describe('ListOverviewService', () => {
  let service: ListOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
      ]
    });
    service = TestBed.inject(ListOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
