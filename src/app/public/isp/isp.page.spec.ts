import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IspPage } from './isp.page';

describe('IspPage', () => {
  let component: IspPage;
  let fixture: ComponentFixture<IspPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IspPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
