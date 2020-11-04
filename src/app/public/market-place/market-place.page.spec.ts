import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlacePage } from './market-place.page';

describe('MarketPlacePage', () => {
  let component: MarketPlacePage;
  let fixture: ComponentFixture<MarketPlacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlacePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
