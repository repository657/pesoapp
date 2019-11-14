import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingPinsPage } from './gaming-pins.page';

describe('GamingPinsPage', () => {
  let component: GamingPinsPage;
  let fixture: ComponentFixture<GamingPinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamingPinsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamingPinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
