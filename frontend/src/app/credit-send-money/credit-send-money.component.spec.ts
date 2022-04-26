import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSendMoneyComponent } from './credit-send-money.component';

describe('CreditSendMoneyComponent', () => {
  let component: CreditSendMoneyComponent;
  let fixture: ComponentFixture<CreditSendMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSendMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
