import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingTransactionsViewComponent } from './saving-transactions-view.component';

describe('SavingTransactionsViewComponent', () => {
  let component: SavingTransactionsViewComponent;
  let fixture: ComponentFixture<SavingTransactionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingTransactionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingTransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
