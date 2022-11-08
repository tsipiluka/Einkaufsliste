import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinkaufslistenOverviewComponent } from './einkaufslisten-overview.component';

describe('EinkaufslistenOverviewComponent', () => {
  let component: EinkaufslistenOverviewComponent;
  let fixture: ComponentFixture<EinkaufslistenOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinkaufslistenOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinkaufslistenOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
