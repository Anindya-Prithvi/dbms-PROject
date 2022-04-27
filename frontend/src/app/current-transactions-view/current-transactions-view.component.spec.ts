import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTransactionsViewComponent } from './current-transactions-view.component';

describe('CurrentTransactionsViewComponent', () => {
  let component: CurrentTransactionsViewComponent;
  let fixture: ComponentFixture<CurrentTransactionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentTransactionsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
