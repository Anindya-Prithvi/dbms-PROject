import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSendMoneyDebitCardComponent } from './current-send-money-debit-card.component';

describe('CurrentSendMoneyDebitCardComponent', () => {
  let component: CurrentSendMoneyDebitCardComponent;
  let fixture: ComponentFixture<CurrentSendMoneyDebitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentSendMoneyDebitCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSendMoneyDebitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
