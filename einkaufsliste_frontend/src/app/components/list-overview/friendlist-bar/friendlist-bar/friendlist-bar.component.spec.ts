import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendlistBarComponent } from './friendlist-bar.component';

describe('FriendlistBarComponent', () => {
  let component: FriendlistBarComponent;
  let fixture: ComponentFixture<FriendlistBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendlistBarComponent ]
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
