import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansPage } from './loans.page';

describe('LoansPage', () => {
  let component: LoansPage;
  let fixture: ComponentFixture<LoansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
