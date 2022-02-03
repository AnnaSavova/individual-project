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

    provisionallyAssign(student: Student, project: Project, worstProject: Project): void {
        throw new Error('Method not implemented.');
    }
    
    breakAssignment(person: Student | Lecturer, potentialProposee: Project): void {
        throw new Error('Method not implemented.');
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
            } else if ((lecturer.match.length = lecturer.capacity)
                        && lecturer.ranking.indexOf(this.getLecturerWorstNonEmptyProject(lecturer)) < lecturer.ranking.indexOf(preferredProject)){
                            this.reject(si, preferredProject);
            } else {
                this.matchUp(si, preferredProject);
                // TODO
            }
        }
    }
}