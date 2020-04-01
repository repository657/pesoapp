import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPinsPage } from './e-pins.page';

describe('EPinsPage', () => {
  let component: EPinsPage;
  let fixture: ComponentFixture<EPinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EPinsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
