import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPassbookComponent } from './current-passbook.component';

describe('CurrentPassbookComponent', () => {
  let component: CurrentPassbookComponent;
  let fixture: ComponentFixture<CurrentPassbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentPassbookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
