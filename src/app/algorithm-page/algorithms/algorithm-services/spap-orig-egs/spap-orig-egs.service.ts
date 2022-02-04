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

    agentIsFree(si: Student): boolean {
        if (si.ranking.length <= 0 || !this.getNextPotentialProposee(si)){
            return true
        }
        return false;
    }

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

    provisionallyAssign(student: Student, project: Project, worstProject: Project): void {
        // provisionally assign si to pj and lk;
        let lecturer = project.lecturer
        
        if (lecturer.match.length > lecturer.capacity){
            let sr: Student = this.getRandomStudent(worstProject);
            // M = M \ {(sr, pz)}
            this.reject(sr, worstProject);
        }
    }

    removeRuledOutPreference(lecturer: Lecturer): void {
        // if lecturer is full
        if (lecturer.match.length === lecturer.capacity){

            let worstProject = this.getLecturerWorstNonEmptyProject(lecturer);
            let worstProjectPosition = this.findPositionInLecturerMatches(lecturer, worstProject);
            let rankingClearCounter: number = worstProjectPosition + 1;
            
            // for each successor pt of pz on lecturer's list:
            for (let i = rankingClearCounter; i < lecturer.ranking.length; i++){
                // for each student sr who finds pt acceptable:
                for (let key of Object.keys(this.group1Agents)){
                    // if the student find pt acceptable
                    if (lecturer.ranking[i].name in this.group1Agents.get(key).ranking){
                        // delete pt from sr's list

                        //this.update();
                        let sr = this.group1Agents.get(key);
                        sr.ranking.splice(i, 1);
                        i -= 1;
                        rankingClearCounter++;
                        this.relevantPreferences.pop();
                    }
                }
            }
        }
    }

    applyTo(si: Student, preferredProject: Project, lecturer: Lecturer): void {
        let pz = lecturer.ranking[-1];
        // if lecturer is non-empty
        if (lecturer.match.length > 0){
            pz = this.getLecturerWorstNonEmptyProject(lecturer);
        }
        if (this.fullAndNonEmpty(lecturer, preferredProject, pz)){
            // delete pj from si's list
            this.reject(si, preferredProject);

        } else {
            // M U { (si, pj) }
            this.matchUp(si, preferredProject);
            this.provisionallyAssign(si, preferredProject, pz);
            this.removeRuledOutPreference(lecturer);
        }
        if (this.shouldContinueMatching(si)) {
            this.freeAgentsOfGroup1.shift();
        } 
    }
    
    checkStability(allMatches: Map<String, String[]>): boolean {
        throw new Error('Method not implemented.');
    }

    // provisionally assign si to pj and lk;

      //let agentLastChar = this.getLastCharacter(student.name);
      //let proposeeLastChar = this.getLastCharacter(project.name);
      //let lecturerLastChar = this.getLastCharacter(project.lecturer.name);

      //this.removeArrayFromArray(this.currentLines, [agentLastChar, proposeeLastChar, lecturerLastChar, "red"]);

      //let greenLine = [agentLastChar, proposeeLastChar, lecturerLastChar, "green"];
      //this.currentLines.push(greenLine);

      //this.changePreferenceStyle(this.group1CurrentPreferences, agentLastChar, this.originalGroup1CurrentPreferences.get(agentLastChar).findIndex(p => p == this.getLastCharacter(project.name)), "green");
      //this.changeAgentStyle(lecturerLastChar, "green");

      //if (project.lecturer.match.length >= project.lecturer.capacity - 1) {
      //  this.algorithmSpecificData["lecturerCapacity"][lecturerLastChar] = "{#53D26F" + this.algorithmSpecificData["lecturerCapacity"][lecturerLastChar] + "}";
      //  this.algorithmSpecificData["projectCapacity"][proposeeLastChar] = "{#53D26F" + this.algorithmSpecificData["projectCapacity"][proposeeLastChar] + "}";
      //}

      //this.update(7, {"%si%": student.name, "%project%": project.name, "%lecturer%": project.lecturer.name}); //TODO: change step number
      //student.match[0] = project;
      //project.lecturer.match[0] = project;
      //project.assigned.push(student);
    
}