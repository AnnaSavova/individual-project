import { AlgorithmData } from "../interfaces/AlgorithmData";
import { Lecturer } from "../interfaces/Lecturer";
import { Project } from "../interfaces/Project";
import { Student } from "../interfaces/Student";
import { MatchingAlgorithmExtension } from "./MatchingAlgorithmExtension";

export abstract class SpaP extends MatchingAlgorithmExtension {

    

    getLecturerWorstNonEmptyProject(lk : Lecturer): Project {
        let positionMap: Map<number, Project> = new Map();

        for (let project of lk.match){
            positionMap.set(this.findPositionInLecturerMatches(lk, project), project);
        }

        let pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        
        while (pz.assigned.length === 0) {
            pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        }
        
        return pz
    }
    
    fullAndNonEmpty(lecturer: Lecturer, preferredProject: Project, worstProject: Project): boolean{
        // if project is full
        if (preferredProject.assigned.length === preferredProject.capacity
            // or (if lecturer is full and preferredProject is lecturer's worst non empty project)
            || (lecturer.match.length === lecturer.capacity && preferredProject === worstProject)){
                return true;
            }
        return false;
    }

    getRandomStudent(project: Project){
        let relevantStudents: Map<String, Student> = new Map();

        for (let [key,value] of this.group1Agents){
            if (value.match === project){
                relevantStudents.set(key, value);
            }
        }

        // from: https://stackoverflow.com/questions/70205185/get-random-element-of-dictionary-in-typescript
        let len = relevantStudents.size;
        if (len > 0){
            return Array.from(relevantStudents.values())[Math.floor(Math.random() * len)];
        }
        return undefined;
    }

    matchUp(student: Student, project: Project){
        student.match = project;
        project.assigned.push(student)
        project.lecturer.match.push(project)
    }

    // TODO: rework reject and implementations

    reject(sr: Student, project: Project){
        //delete sr.ranking[project.name];
        this.relevantPreferences.pop();
        
        if (project.name == sr.match.name){
            sr.match = undefined;
            delete project.assigned[sr.name];
            delete project.lecturer.match[project.name];
        }
    }

    /** Check Stability */
    

    checkAssignedBlockPair(allMatches: Map <String, String>){
        let currProject: Project;
        let worstNonEmpty: Project = undefined;
        
        let projectTracker: number = 0;

        console.log("stability allMatches", allMatches);
        for (let sr of allMatches.keys()) {
            let student: Student = this.group1Agents.get(sr);
            let studentPreferences = this.group1CurrentPreferences.get(sr);

            
            if (allMatches.get(sr) != "No Assignment"){
                console.log("stability sr", allMatches.get(sr));
                console.log("stability student", student);

                //projectTracker = studentPreferences.indexOf(student.match.name);
                
                // if project undersubscribed 
                if (currProject.capacity < currProject.assigned.length) {
                    // and its lecturer is full
                    if (currProject.lecturer.capacity == currProject.lecturer.match.length){
                        worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer)
                        // if lecturer prefers currProject to their worst non empty
                        if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
                            console.log("Student assigned with full teacher who prefers currProject");
                            return false;
                        }
                    // if project and lecturer both undersubscribed
                    } else {
                        console.log("Student assigned with undersubscribed lecturer");
                        return false;
                    }
                }
                return true
            } else {
                //return false;
                
                // for every project in that student's list
                for (let pj: number = 0; pj < studentPreferences.length; pj++){
                    currProject = this.group3Agents.get(studentPreferences[pj]);
                    // if lecturer is full
                    if (currProject.lecturer.capacity == currProject.lecturer.match.length){
                        worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer);
                        // if currProject is preferred over worstNonEmptyProject
                        if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
                            console.log("Unassigned student with full teacher")
                            return false;
                        } else {
                            console.log("Unassinged student with undersubscribed lecturer");
                            return false;
                        }
                    }
                }
                return true;
            }
            
            
            // 
            // if (currProject.capacity < currProject.assigned.length) {
            //     // and its lecturer is full
            //     if (currProject.lecturer.capacity == currProject.lecturer.match.length){
            //         worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer)
            //         // if lecturer prefers currProject to their worst non empty
            //         if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
            //             console.log("Student assigned with full teacher who prefers currProject");
            //             return false;
            //         }
            //     // if project and lecturer both undersubscribed
            //     } else {
            //         console.log("Student assigned with undersubscribed lecturer");
            //         return false;
            //     }
            // }
        }
        //return true;
    }

    // checkUnassigned(matchlessStudents: Map <String, Student>){
    //     let currProject: Project;
    //     let worstNonEmpty: Project = undefined;

    //     for (let sr of matchlessStudents.keys()){
    //         let studentPreferences = this.group1CurrentPreferences.get(sr);
    //         // for every project in that student's list
    //         for (let pj: number = 0; pj < studentPreferences.length; pj++){
    //             currProject = this.group3Agents.get(studentPreferences[pj]);
    //             // if lecturer is full
    //             if (currProject.lecturer.capacity == currProject.lecturer.match.length){
    //                 worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer);
    //                 // if currProject is preferred over worstNonEmptyProject
    //                 if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
    //                     console.log("Unassigned student with full teacher")
    //                     return false;
    //                 }
    //             } else {
    //                 console.log("Unassinged student with undersubscribed lecturer");
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }


    checkStability(allMatches: Map<String, String>): boolean {

        let stability = this.checkAssignedBlockPair(allMatches);

        // let matchless: Map<String, Student>;

        // // matchless = this.group1Agents - allMatches
        
        // for (let si of this.group1Agents.keys()){
        //     console.log("matchless si:", si);
        // }

        // let unassignedStability = this.checkUnassigned(matchless);
        
        // if (assignedStability && unassignedStability){return true;}
        //  else { return false};

        return stability;

    }

    match(): AlgorithmData {
        console.log("MatchingAlgorithmExtension match");
        // assign each student to be free;
        this.update(1);     // TODO place breakpoint

        while (this.freeAgentsOfGroup1.length > 0) {

            this.currentlySelectedAgents = [];
            this.relevantPreferences = [];

            // while (some student si is unassigned) and (si's preference list is non-empty) {
            let si = this.group1Agents.get(this.freeAgentsOfGroup1[0]);   // current student si
            this.currentlySelectedAgents.push(this.getLastCharacter(si.name));
            this.relevantPreferences.push(this.getLastCharacter(si.name));


            // if all potential proposees are gone, remove 
            if (this.agentToFree(si)) {     // TODO rename;
                this.freeAgentsOfGroup1.shift();
            } else {

                this.update(2, {"%currentAgent%": si.name});
 
                // first such project on si's list;
                let preferredProject: Project = this.getNextPotentialProposee(si);
                let lecturer: Lecturer = this.getProjectLecturer(preferredProject);

                let agentLastChar = this.getLastCharacter(si.name);
                let proposeeLastChar = this.getLastCharacter(preferredProject.name);
                
                let lecturerLastChar = this.getLastCharacter(lecturer.name) //TODO potentially breaks here

                this.currentlySelectedAgents.push(proposeeLastChar);
                this.relevantPreferences.push(proposeeLastChar);

                this.changePreferenceStyle(this.group1CurrentPreferences, agentLastChar, this.originalGroup1CurrentPreferences.get(agentLastChar).findIndex(project => project == this.getLastCharacter(preferredProject.name)), "red");
                this.changeAgentStyle(lecturerLastChar, "red")

                let redLine = [agentLastChar, proposeeLastChar, lecturerLastChar, "red"];
                this.currentLines.push(redLine);

                this.update(3, {"%currentAgent%": si.name, "%preferredProject%": preferredProject.name});

                // student applies to project
                this.applyTo(si, preferredProject, lecturer); 

                if (this.shouldContinueMatching(si)) {
                    this.freeAgentsOfGroup1.shift();
                }
            }
        }

        this.currentlySelectedAgents = [];
        this.relevantPreferences = [];
        // a stable matching has been found
        this.update(12);        //TODO fix step number

        return;
    }

    abstract applyTo(si: Student, preferredProject: Project, lecturer: Lecturer): void;

    abstract getNextPotentialProposee(student: Student): Project;

    abstract getProjectLecturer(project: Project): Lecturer;

    abstract shouldContinueMatching(student: Student): boolean;

    //abstract provisionallyAssign(student: Student, preferredProject: Project, worstProject: Project): void;

    abstract agentToFree(student: Student): boolean;

    /** removeRuledOutPreferences group: */ 
    
    //abstract removeRuledOutPreferencesFromStudent(student: Student, preferredProject: Project): void;

    //abstract removeRuledOutPreferencesFromLecturer(lecturer: Lecturer, preferredProject: Project): void;
    /** end of group */ 

}