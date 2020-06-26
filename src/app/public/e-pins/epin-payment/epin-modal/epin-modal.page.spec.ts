import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpinModalPage } from './epin-modal.page';

describe('EpinModalPage', () => {
  let component: EpinModalPage;
  let fixture: ComponentFixture<EpinModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpinModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpinModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
