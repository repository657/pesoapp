import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizePage } from './personalize.page';

describe('PersonalizePage', () => {
  let component: PersonalizePage;
  let fixture: ComponentFixture<PersonalizePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
