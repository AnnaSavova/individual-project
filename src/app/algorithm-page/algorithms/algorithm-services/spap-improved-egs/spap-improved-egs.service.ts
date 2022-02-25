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

    agentToFree(student: Student): boolean {
        if (this.isPromoted(student)
            && (student.ranking.length <= 0 || !this.getNextPotentialProposee(student))) {
            return true;
        }
        return false;
    }

    getProjectLecturer(project: Project): Lecturer {
        return project.lecturer;
    }
    
    //checkStability(allMatches: Map<String, String[]>): boolean {
    // TODO change
    //    let stability = true;

    //    return stability;
    //}

    getNextPotentialProposee(student: Student): Project {
    // return first project on si's list
        return student.ranking[0];
    }

    shouldContinueMatching(student: Student): boolean {
        return true;
    }

    
    getRandomUnpromoted(project){
        let relevantStudents: Map<String, Student> = new Map();

        for (let [key,value] of this.group1Agents){
            //value.match.includes(project)
            if ( value.match === project && !(this.isPromoted(value))){
                relevantStudents.set(key, value);
            }
        }

        if (relevantStudents.size == 0){
            return undefined;
        }

        // from: https://stackoverflow.com/questions/70205185/get-random-element-of-dictionary-in-typescript
        let sr = this.group1Agents[Math.floor(Math.random() * Object.keys(relevantStudents).length)];
        return sr;
    }

    guaranteedStability(matchCount: number, stabilityTracker: number) {
        if (matchCount / stabilityTracker >= (3/2)){
            return true;
        } else {
            return false;
        }
    }

    applyTo(si: Student, preferredProject: Project, lecturer: Lecturer) {
        console.log("SpaP iteration")
        if (si.ranking.length = 0 && !this.isPromoted(si) && si.match == undefined){
            this.promote(si);
        }
        // preferred project and its lecturer are already known from SpaP.ts

        //if the project and the lecturer are both full and the project is the lecturer's worst nonempty project
        if (this.fullAndNonEmpty(lecturer, preferredProject, lecturer.ranking[lecturer.ranking.length-1])){
            // if the student is unpromoted or no unpromoted student in M(pj)
            if (!this.isPromoted(si) || this.getRandomUnpromoted(preferredProject) === undefined) {
                console.log("Rejection condition A between", si, "and", preferredProject);
                this.reject(si, preferredProject);
            } else{
                // reject random unpromoted student in M (pj)
                let sr = this.getRandomUnpromoted(preferredProject);
                console.log("Rejection condition A.2 between", sr, "and", preferredProject)
                this.reject(sr, preferredProject);

                // M U { (si, pj) }
                this.matchUp(si, preferredProject);
            }
        // if lecturer is full and prefers their preferredProject to their worst project
        } else if ((lecturer.match.length = lecturer.capacity)
                    && lecturer.ranking.indexOf(preferredProject) < lecturer.ranking.indexOf(this.getLecturerWorstNonEmptyProject(lecturer))){
                        console.log("Rejection condition B between", si, "and", preferredProject)
                        this.reject(si, preferredProject);
        } else {
            this.matchUp(si, preferredProject);
                
            if (lecturer.match.length > lecturer.capacity){
                let pz = this.getLecturerWorstNonEmptyProject(lecturer); // lk prefers pj over pz
                
                let unpromotedReject: boolean = false;
                //let randomReject: boolean = false;

                for (let i = 0; i < pz.assigned.length; i++){
                    // if the project is assigned to a non-promoted student
                    if (!(this.isPromoted(pz.assigned[i]))){
                        // reject a random unpromoted student
                        //sr = this.getRandomUnpromoted(pz);
                        unpromotedReject = true;
                    // } else {
                    //     //sr = this.getRandomStudent(pz);
                    //     randomReject = true;
                    // }
                    // let sr: Student;
                    // this.reject(sr, pz);
                    }
                }
                
                let sr: Student;

                if (unpromotedReject = true){
                    sr = this.getRandomUnpromoted(pz);
                } else{
                    sr = this.getRandomStudent(pz);
                }
                console.log("Rejection condition C between", sr, "and", pz);
                this.reject(sr, pz);
            }
        }
    }
}