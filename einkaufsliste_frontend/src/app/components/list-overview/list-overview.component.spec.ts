import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment.prod';

import { ListOverviewComponent } from './list-overview.component';

describe('ListOverviewComponent', () => {
  let component: ListOverviewComponent;
  let fixture: ComponentFixture<ListOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ListOverviewComponent ],
      providers: [
        { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
