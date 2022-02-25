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

  fit('test correctness x10000 (spap-improved-egs)', () => {
    let stable: boolean = true;
    const startTotal = new Date().getTime();
    for (let i = 0; i < 100; i++) { 
      console.log("Improved SpaP iteration", i);
      let agent1Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Student number: ", agent1Count)
      let agent2Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Lecturer number: ", agent2Count)
      let agent3Count: number = Math.floor(Math.random() * (9 - 2) + 2);
      console.log("Project number: ", agent3Count)
      let preferences: Map<String, Array<String>> = new Map();
      const start = new Date().getTime();
      service.run(agent1Count, agent2Count, preferences, agent3Count);    // TODO breaks here maybe
      let elapsed = new Date().getTime() - start;
      console.log("Test correctness iteration:", i, "Elapsed time:", elapsed);
      if (!service.stable) {
        stable = false;
      }
    }
    let elapsedTotal = new Date().getTime() - startTotal;
    console.log("Test correctness elapsed time total:", elapsedTotal);
    expect(stable).toBeTrue();
  });

});