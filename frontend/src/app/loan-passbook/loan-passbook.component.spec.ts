import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPassbookComponent } from './loan-passbook.component';

describe('LoanPassbookComponent', () => {
  let component: LoanPassbookComponent;
  let fixture: ComponentFixture<LoanPassbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPassbookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
