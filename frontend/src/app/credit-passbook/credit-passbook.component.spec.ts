import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPassbookComponent } from './credit-passbook.component';

describe('CreditPassbookComponent', () => {
  let component: CreditPassbookComponent;
  let fixture: ComponentFixture<CreditPassbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditPassbookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
