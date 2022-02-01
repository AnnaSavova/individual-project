import { Injectable } from '@angular/core';
import { SpaP } from '../../abstract-classes/SpaP';
import { Lecturer } from '../../interfaces/Lecturer';
import { Project } from '../../interfaces/Project';
import { Student } from '../../interfaces/Student';

//TODO EDITING

@Injectable({
    providedIn: 'root'
  })
  export class SpapImprovedEgsService extends SpaP {
    
    group1Name = "student";
    group2Name = "project";
    group3Name = "lecturer";

    lecturerCapacity : Map<string, number> = new Map();
    projectCapacity: Map<string, number> = new Map();

    getProjectLecturer(project: Project): Lecturer {
        throw new Error('Method not implemented.');
    }

    reject(student: Student, project: Project): void {
        throw new Error('Method not implemented.');
    }
    
    checkStability(allMatches: Map<String, String[]>): boolean {
        throw new Error('Method not implemented.');
    }

    getNextPotentialProposee(student: Student): Project {
        throw new Error('Method not implemented.');
    }

    shouldContinueMatching(student: Student): boolean {
        return true;
    }

    provisionallyAssign(student: Student, project: Project): void {
        throw new Error('Method not implemented.');
    }
    
    breakAssignment(person: Student | Lecturer, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }

    applyTo(si: Student, preferredProject: Project, lecturer: Lecturer) {
        throw new Error('Method not implemented.');
    }
}