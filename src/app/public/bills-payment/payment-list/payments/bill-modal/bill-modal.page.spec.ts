import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillModalPage } from './bill-modal.page';

describe('BillModalPage', () => {
  let component: BillModalPage;
  let fixture: ComponentFixture<BillModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
