import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingPassbookComponent } from './saving-passbook.component';

describe('SavingPassbookComponent', () => {
  let component: SavingPassbookComponent;
  let fixture: ComponentFixture<SavingPassbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingPassbookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
