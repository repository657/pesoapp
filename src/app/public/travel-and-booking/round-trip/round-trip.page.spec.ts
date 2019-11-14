import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTripPage } from './round-trip.page';

describe('RoundTripPage', () => {
  let component: RoundTripPage;
  let fixture: ComponentFixture<RoundTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundTripPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
