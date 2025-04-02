import { TestBed } from '@angular/core/testing';

import { FinantialService } from './finantial.service';

describe('FinantialService', () => {
  let service: FinantialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinantialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
