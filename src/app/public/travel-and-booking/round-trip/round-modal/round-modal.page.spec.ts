import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundModalPage } from './round-modal.page';

describe('RoundModalPage', () => {
  let component: RoundModalPage;
  let fixture: ComponentFixture<RoundModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
