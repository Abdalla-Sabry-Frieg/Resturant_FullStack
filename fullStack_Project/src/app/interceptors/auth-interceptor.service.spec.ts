import { TestBed } from '@angular/core/testing';

import { tokenInterceptor } from './auth-interceptor.service';

describe('AuthInterceptorService', () => {
  let service: tokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tokenInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
