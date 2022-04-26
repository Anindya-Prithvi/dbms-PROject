import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLandingComponent } from './credit-landing.component';

describe('CreditLandingComponent', () => {
  let component: CreditLandingComponent;
  let fixture: ComponentFixture<CreditLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
