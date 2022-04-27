import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransactionsViewComponent } from './credit-transactions-view.component';

describe('CreditTransactionsViewComponent', () => {
  let component: CreditTransactionsViewComponent;
  let fixture: ComponentFixture<CreditTransactionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTransactionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
