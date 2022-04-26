import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSendMoneyComponent } from './current-send-money.component';

describe('CurrentSendMoneyComponent', () => {
  let component: CurrentSendMoneyComponent;
  let fixture: ComponentFixture<CurrentSendMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentSendMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
