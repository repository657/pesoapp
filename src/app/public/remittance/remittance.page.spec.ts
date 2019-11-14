import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittancePage } from './remittance.page';

describe('RemittancePage', () => {
  let component: RemittancePage;
  let fixture: ComponentFixture<RemittancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
