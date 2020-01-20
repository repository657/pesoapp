import { TestBed } from '@angular/core/testing';

import { ChangeService } from './change.service';

describe('ChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeService = TestBed.get(ChangeService);
    expect(service).toBeTruthy();
  });
});
