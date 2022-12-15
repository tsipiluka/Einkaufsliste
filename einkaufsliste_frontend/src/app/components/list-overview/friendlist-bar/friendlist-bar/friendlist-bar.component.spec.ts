import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FriendlistBarComponent } from './friendlist-bar.component';

describe('FriendlistBarComponent', () => {
  let component: FriendlistBarComponent;
  let fixture: ComponentFixture<FriendlistBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FriendlistBarComponent ],
      providers: [MessageService, ConfirmationService],
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
