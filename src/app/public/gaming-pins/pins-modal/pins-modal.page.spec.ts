import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinsModalPage } from './pins-modal.page';

describe('PinsModalPage', () => {
  let component: PinsModalPage;
  let fixture: ComponentFixture<PinsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
