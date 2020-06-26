import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpinPaymentPage } from './epin-payment.page';

describe('EpinPaymentPage', () => {
  let component: EpinPaymentPage;
  let fixture: ComponentFixture<EpinPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpinPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpinPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
