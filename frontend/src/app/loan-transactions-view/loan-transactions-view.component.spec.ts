import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTransactionsViewComponent } from './loan-transactions-view.component';

describe('LoanTransactionsViewComponent', () => {
  let component: LoanTransactionsViewComponent;
  let fixture: ComponentFixture<LoanTransactionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTransactionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
