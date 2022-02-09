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
    group3Name = "project";
    group2Name = "lecturer";

    lecturerCapacity : Map<string, number> = new Map();
    projectCapacity: Map<string, number> = new Map();

    isPromoted(student: Student): boolean{
        return student.promoted
    }

    promote(student: Student): void{
        student.promoted = true;
    }

    unpromote(student: Student): void{
        student.promoted = false;
    }

    agentIsFree(student: Student): boolean {
        if (this.isPromoted(student)
            && (student.ranking.length <= 0 || !this.getNextPotentialProposee(student))) {
            return true;
        }
        return false;
    }

    getProjectLecturer(project: Project): Lecturer {
        return project.lecturer;
    }
    
    checkStability(allMatches: Map<String, String[]>): boolean {
    // TODO change
        return true;
    }

    getNextPotentialProposee(student: Student): Project {
    // return first project on si's list
        console.log("student: ", student, "ranking: ", student.ranking.length);
        return student.ranking[0];
    }

    shouldContinueMatching(student: Student): boolean {
        return true;
    }

    
    getRandomUnpromoted(project){
        let relevantStudents: Map<String, Student> = new Map();

        for (let [key,value] of this.group1Agents){
            if (value.match.includes(project) && !(this.isPromoted(value))){
                relevantStudents.set(key, value);
            }
        }

        // from: https://stackoverflow.com/questions/70205185/get-random-element-of-dictionary-in-typescript
        let sr = this.group1Agents[Math.floor(Math.random() * Object.keys(relevantStudents).length)];
        return sr;
    }

    applyTo(si: Student, preferredProject: Project, lecturer: Lecturer) {
        if (si.ranking.length = 0 && !this.isPromoted(si)){
            this.promote(si);
        } else {
            if (this.fullAndNonEmpty){
                // if the student is unpromoted and no unpromoted student is matched with preferredProject
                if (!this.isPromoted(si)) {
                    this.reject(si, preferredProject);
                } else{
                    // reject random unpromoted student in M (pj)

                    // M U { (si, pj) }
                    this.matchUp(si, preferredProject);
                }
            // if lecturer is full and preferes their preferredPeoject to their worst project
            } else if ((lecturer.match.length = lecturer.capacity)
                        && lecturer.ranking.indexOf(preferredProject) < lecturer.ranking.indexOf(this.getLecturerWorstNonEmptyProject(lecturer))){
                            this.reject(si, preferredProject);
            } else {
                this.matchUp(si, preferredProject);
                
                if (lecturer.match.length > lecturer.capacity){
                    let pz = this.getLecturerWorstNonEmptyProject(lecturer);
                    
                    for (let i = 0; i < pz.assigned.length; i++){
                        let sr: Student;
                        // if the project is assigned to a non-promoted student
                        if (!(this.isPromoted(pz.assigned[i]))){
                            // reject a random unpromoted student
                            sr = this.getRandomUnpromoted(pz);
                        } else {
                            sr = this.getRandomStudent(pz);
                        }
                        this.reject(sr, pz);
                    }
                }
            }
        }
    }
}