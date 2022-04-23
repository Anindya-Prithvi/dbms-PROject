import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingPassbookSendMoneyComponent } from './saving-passbook-send-money.component';

describe('SavingPassbookSendMoneyComponent', () => {
  let component: SavingPassbookSendMoneyComponent;
  let fixture: ComponentFixture<SavingPassbookSendMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingPassbookSendMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingPassbookSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
