import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingSendMoneyComponent } from './saving-send-money.component';

describe('SavingSendMoneyComponent', () => {
  let component: SavingSendMoneyComponent;
  let fixture: ComponentFixture<SavingSendMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingSendMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
