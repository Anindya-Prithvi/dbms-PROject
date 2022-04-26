import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanLandingComponent } from './loan-landing.component';

describe('LoanLandingComponent', () => {
  let component: LoanLandingComponent;
  let fixture: ComponentFixture<LoanLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
