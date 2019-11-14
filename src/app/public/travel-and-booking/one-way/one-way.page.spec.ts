import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneWayPage } from './one-way.page';

describe('OneWayPage', () => {
  let component: OneWayPage;
  let fixture: ComponentFixture<OneWayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneWayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneWayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
