import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadModalPage } from './download-modal.page';

describe('DownloadModalPage', () => {
  let component: DownloadModalPage;
  let fixture: ComponentFixture<DownloadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
