import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovModalPage } from './gov-modal.page';

describe('GovModalPage', () => {
  let component: GovModalPage;
  let fixture: ComponentFixture<GovModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
