import { TestBed } from '@angular/core/testing';

import { SpapOrigEgsService } from './spap-orig-egs.service';

describe('SpapOrigEgsService', () => {
  let service: SpapOrigEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpapOrigEgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test correctness x10000 (spap-orig-egs)', () => {
    let stable: boolean = true;
    for (let i = 0; i < 100; i++) {
      console.log("Original SpaP iteration", i);
      let agent1Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Student number: ", agent1Count)
      let agent2Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Lecturer number: ", agent2Count)
      let agent3Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Project number: ", agent3Count)
      let preferences: Map<String, Array<String>> = new Map();
      service.run(agent1Count, agent2Count, preferences, agent3Count);    // TODO breaks here maybe
      if (!service.stable) {
        stable = false;
      }
    }
    
    expect(stable).toBeTrue();
  });

});