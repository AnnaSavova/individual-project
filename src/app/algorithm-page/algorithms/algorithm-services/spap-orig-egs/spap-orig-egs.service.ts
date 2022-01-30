import { Injectable } from '@angular/core';
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

    getNextPotentialProposee(student: Student): Project {
        // return first project on si's list
      return student.ranking[0];
    }

    shouldContinueMatching(student: Student): boolean {
        return true;
    }
    provisionallyAssign(student: Student, project: Project): void {
    // provisionally assign si to pj and lk;

      let agentLastChar = this.getLastCharacter(student.name);
      let proposeeLastChar = this.getLastCharacter(project.name);
      let lecturerLastChar = this.getLastCharacter(project.lecturer.name);

      this.removeArrayFromArray(this.currentLines, [agentLastChar, proposeeLastChar, "red"]);
      this.removeArrayFromArray(this.currentLines, [agentLastChar, lecturerLastChar, "red"]);

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
    breakAssignment(person: Student | Lecturer, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }
}