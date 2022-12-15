import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ShoppinglistService } from './shoppinglist.service';

describe('ShoppinglistService', () => {
  let service: ShoppinglistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'BACKEND_URL', useValue: 'http://localhost:8080' }
      ]
    });
    service = TestBed.inject(ShoppinglistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
