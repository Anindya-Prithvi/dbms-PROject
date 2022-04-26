import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentLandingComponent } from './current-landing.component';

describe('CurrentLandingComponent', () => {
  let component: CurrentLandingComponent;
  let fixture: ComponentFixture<CurrentLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
