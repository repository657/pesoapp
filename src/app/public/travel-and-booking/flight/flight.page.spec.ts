import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPage } from './flight.page';

describe('FlightPage', () => {
  let component: FlightPage;
  let fixture: ComponentFixture<FlightPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
