import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBankPage } from './payment-bank.page';

describe('PaymentBankPage', () => {
  let component: PaymentBankPage;
  let fixture: ComponentFixture<PaymentBankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentBankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
