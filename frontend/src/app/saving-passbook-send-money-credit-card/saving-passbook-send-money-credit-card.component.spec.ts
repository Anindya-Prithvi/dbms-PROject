import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingPassbookSendMoneyCreditCardComponent } from './saving-passbook-send-money-credit-card.component';

describe('SavingPassbookSendMoneyCreditCardComponent', () => {
  let component: SavingPassbookSendMoneyCreditCardComponent;
  let fixture: ComponentFixture<SavingPassbookSendMoneyCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingPassbookSendMoneyCreditCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingPassbookSendMoneyCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
