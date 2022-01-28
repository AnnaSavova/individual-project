import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';
import { Injectable } from '@angular/core';
import { MatchingAlgorithmExtension } from '../../abstract-classes/MatchingAlgorithmExtension';
import { SpaP } from '../../abstract-classes/SpaP';
import { Agent } from '../../interfaces/Agent';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Lecturer } from '../../interfaces/Lecturer';
import { Project } from '../../interfaces/Project';
import { Student } from '../../interfaces/Student';

@Injectable({
    providedIn: 'root'
  })
  export class SpapOrigEgsService extends SpaP {

    group1Name = "student"
    group2Name = "lecturer"
    group3Name = "project"

    lecturerCapacity : Map<string, number> = new Map();
    projectCapacity: Map<string, number> = new Map();

    getLecturerWorstNonEmptyProject(lk : Lecturer): Project {
        let positionMap: Map<number, Project> = new Map();

        for (let project of lk.match){
            positionMap.set(this.findPositionInMatches(lk, project), project);
        }

        let pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        
        while (pz.assigned.length === 0) {
            pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        }
        
        return pz
    }

    getNextPotentialProposee(project: Student): Project {
        throw new Error('Method not implemented.');
    }
    shouldContinueMatching(currentAgent: Agent): boolean {
        throw new Error('Method not implemented.');
    }
    provisionallyAssign(currentAgent: Student, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }
    removeRuledOutPreferencesFromStudent(currentAgent: Student, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }
    removeRuledOutPreferencesFromLecturer(currentAgent: Lecturer, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }
    checkStability(allMatches: Map<String, String[]>): boolean {
        throw new Error('Method not implemented.');
    }
    match(): AlgorithmData {
        throw new Error('Method not implemented.');
    }
    removeRuledOutPreferences(currentAgent: Agent, potentialProposee: Agent): void {
        throw new Error('Method not implemented.');
    }
    breakAssignment(currentAgent: Agent, potentialProposee: Agent): void {
        throw new Error('Method not implemented.');
    }
}