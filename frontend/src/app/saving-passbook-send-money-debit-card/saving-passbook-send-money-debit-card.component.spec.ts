import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingPassbookSendMoneyDebitCardComponent } from './saving-passbook-send-money-debit-card.component';

describe('SavingPassbookSendMoneyDebitCardComponent', () => {
  let component: SavingPassbookSendMoneyDebitCardComponent;
  let fixture: ComponentFixture<SavingPassbookSendMoneyDebitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingPassbookSendMoneyDebitCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingPassbookSendMoneyDebitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
