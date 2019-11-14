import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentBillersPage } from './government-billers.page';

describe('GovernmentBillersPage', () => {
  let component: GovernmentBillersPage;
  let fixture: ComponentFixture<GovernmentBillersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernmentBillersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernmentBillersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
