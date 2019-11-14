import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ELoadPage } from './e-load.page';

describe('ELoadPage', () => {
  let component: ELoadPage;
  let fixture: ComponentFixture<ELoadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ELoadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ELoadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
