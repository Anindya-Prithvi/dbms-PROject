import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingLandingComponent } from './saving-landing.component';

describe('SavingLandingComponent', () => {
  let component: SavingLandingComponent;
  let fixture: ComponentFixture<SavingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
