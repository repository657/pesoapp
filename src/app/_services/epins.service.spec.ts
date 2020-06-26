import { TestBed } from '@angular/core/testing';

import { EpinsService } from './epins.service';

describe('EpinsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpinsService = TestBed.get(EpinsService);
    expect(service).toBeTruthy();
  });
});
