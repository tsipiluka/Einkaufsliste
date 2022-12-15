import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';

import { FriendlistBarComponent } from './friendlist-bar.component';

describe('FriendlistBarComponent', () => {
  let component: FriendlistBarComponent;
  let fixture: ComponentFixture<FriendlistBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FriendlistBarComponent ],
      providers: [MessageService, ConfirmationService,
      { provide: 'BACKEND_URL', useValue: environment.BACKEND_URL }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendlistBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
