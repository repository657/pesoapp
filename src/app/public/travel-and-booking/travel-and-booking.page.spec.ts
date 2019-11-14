import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAndBookingPage } from './travel-and-booking.page';

describe('TravelAndBookingPage', () => {
  let component: TravelAndBookingPage;
  let fixture: ComponentFixture<TravelAndBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelAndBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAndBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
