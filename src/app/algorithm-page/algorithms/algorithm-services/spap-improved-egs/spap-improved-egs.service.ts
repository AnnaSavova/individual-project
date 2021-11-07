import { Injectable } from '@angular/core';
import { ExtendedGaleShapley } from '../../abstract-classes/ExtendedGaleShapley';
import { SpaP } from '../../abstract-classes/SpaP';
import { Agent } from '../../interfaces/Agent';
import { AlgorithmData } from '../../interfaces/AlgorithmData';

//NEEDS EDITING

@Injectable({
    providedIn: 'root'
  })
  export class SpapImprovedEgsService extends SpaP {
    match(): AlgorithmData {
        throw new Error('Method not implemented.');
    }
    getNextPotentialProposee(currentAgent: Agent): Agent {
        throw new Error('Method not implemented.');
    }
    shouldContinueMatching(currentAgent: Agent): boolean {
        throw new Error('Method not implemented.');
    }
    provisionallyAssign(currentAgent: Agent, potentialProposee: Agent): void {
        throw new Error('Method not implemented.');
    }
    removeRuledOutPreferences(currentAgent: Agent, potentialProposee: Agent): void {
        throw new Error('Method not implemented.');
    }
    breakAssignment(currentAgent: Agent, potentialProposee: Agent): void {
        throw new Error('Method not implemented.');
    }
  
    group1Name = "student";
    group2Name = "project";
    group3Name = "lecturer"
    }