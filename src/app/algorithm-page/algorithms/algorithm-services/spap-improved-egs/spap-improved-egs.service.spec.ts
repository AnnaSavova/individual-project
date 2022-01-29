import { TestBed } from '@angular/core/testing';

import { SpapImprovedEgsService } from './spap-improved-egs.service';

describe('SpapImprovedEgsService', () => {
  let service: SpapImprovedEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpapImprovedEgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test correctness x10000 (spap-orig-egs)', () => {
    let stable: boolean = true;
    for (let i = 0; i < 10000; i++) {
      let agent1Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      let agent2Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      let agent3Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      service.run(agent1Count, agent2Count, agent3Count, undefined, undefined); 
      if (!service.stable) {
        stable = false;
      }
    }
    
    expect(stable).toBeTrue();
  });

});