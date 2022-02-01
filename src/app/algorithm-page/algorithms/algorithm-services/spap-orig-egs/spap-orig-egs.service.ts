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

    //lecturerCapacity : Map<string, number> = new Map();
    //projectCapacity: Map<string, number> = new Map();

    getProjectLecturer(project: Project): Lecturer {
        return project.lecturer;
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

      this.removeArrayFromArray(this.currentLines, [agentLastChar, proposeeLastChar, lecturerLastChar, "red"]);

      let greenLine = [agentLastChar, proposeeLastChar, lecturerLastChar, "green"];
      this.currentLines.push(greenLine);

      this.changePreferenceStyle(this.group1CurrentPreferences, agentLastChar, this.originalGroup1CurrentPreferences.get(agentLastChar).findIndex(p => p == this.getLastCharacter(project.name)), "green");
      this.changeAgentStyle(lecturerLastChar, "green");

      if (project.lecturer.match.length >= project.lecturer.capacity - 1) {
        this.algorithmSpecificData["lecturerCapacity"][lecturerLastChar] = "{#53D26F" + this.algorithmSpecificData["lecturerCapacity"][lecturerLastChar] + "}";
        this.algorithmSpecificData["projectCapacity"][proposeeLastChar] = "{#53D26F" + this.algorithmSpecificData["projectCapacity"][proposeeLastChar] + "}";
      }

      this.update(7, {"%si%": student.name, "%project%": project.name, "%lecturer%": project.lecturer.name}); //TODO: change step number
      student.match[0] = project;
      project.lecturer.match[0] = project;
      project.assigned.push(student);

    }

    reject(student: Student, project: Project): void {
        throw new Error('Method not implemented.');
    }
    
    checkStability(allMatches: Map<String, String[]>): boolean {
        throw new Error('Method not implemented.');
    }
    
    breakAssignment(person: Student | Lecturer, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
    }

    applyTo(si: Student, preferredProject: Project, lecturer: Lecturer): void {
        let pz = lecturer.ranking[-1];
        if (lecturer.match.length > 0){
            pz = this.getLecturerWorstNonEmptyProject(lecturer);
        }

        if (this.fullAndNonEmpty){
            // delete pj from si's list
        } else {
            // M U { (si, pj) }
            this.provisionallyAssign(si, preferredProject);
        }
    }
    
}