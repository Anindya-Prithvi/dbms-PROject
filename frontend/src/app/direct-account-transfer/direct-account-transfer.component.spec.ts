import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectAccountTransferComponent } from './direct-account-transfer.component';

describe('DirectAccountTransferComponent', () => {
  let component: DirectAccountTransferComponent;
  let fixture: ComponentFixture<DirectAccountTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectAccountTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectAccountTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
