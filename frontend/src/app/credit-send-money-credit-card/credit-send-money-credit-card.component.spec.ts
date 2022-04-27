import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSendMoneyCreditCardComponent } from './credit-send-money-credit-card.component';

describe('CreditSendMoneyCreditCardComponent', () => {
  let component: CreditSendMoneyCreditCardComponent;
  let fixture: ComponentFixture<CreditSendMoneyCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSendMoneyCreditCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditSendMoneyCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
