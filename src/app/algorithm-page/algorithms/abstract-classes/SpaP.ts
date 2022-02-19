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
        
        if (project.name in sr.match){
            delete sr.match[project.name];
            delete project.assigned[sr.name];
            delete project.lecturer.match[project.name];
        }
    }

    /** Check Stability */
    

    checkAssignedBlockPair(allMatches: Map <String, String>){
        let currProject: Project;
        let worstNonEmpty: Project = undefined;
        
        let projectTracker: number = 0;

        for (let sr of allMatches.keys()) {
            let studentPreferences = this.group1CurrentPreferences.get(sr);
            projectTracker = studentPreferences.indexOf(sr.match.name);

        }
    }

    checkUnassigned(students: Map <String, Student>){
        let currProject: Project;
        let worstNonEmpty: Project = undefined;
    }


    checkStability(allMatches: Map<String, String>): boolean {
        let stability = true;

        this.checkAssignedBlockPair(allMatches);

        let matchless: Map<String, Student>;

        // matchless = this.group1Agents - allMatches

        this.checkUnassigned(matchless);


        // let currProject: Project;
        // let worstNonEmpty: Project = undefined;

        // let projectTracker: number = 0;

        // for (let sr of allMatches.keys()) {
        //     let studentPreferences = this.group1CurrentPreferences.get(sr);
        //     projectTracker = studentPreferences.indexOf(sr.match.name);
        //     //projectTracker = s.preferenceList.indexOf(s.proj);
            
        //     // For every project s prefers
        //     for (let p = 0; p < projectTracker; p++) {
        //         currProject = this.group3Agents.get(studentPreferences[p]);
        //         // If currentProj is undercapacity and currentProj's lecturer is full
        //         if (currProject.capacity != currProject.assigned.length) {
        //             if (currProject.lecturer.capacity === currProject.lecturer.match.length){
        //                 worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer);
        //                 // If currentProj's lecturer prefers currentProj to their worst non empty project
        //                 if (this.getProjectLecturer(currProject).ranking.indexOf(currProject) < this.getProjectLecturer(currProject).ranking.indexOf(worstNonEmpty)){
        //                     console.log("Student assignment to full lecturer")
        //                     return false;
        //                 }
        //             }
        //             else {
        //                 // if both are undersubscribed:
        //                 console.log("Student assignment to undersubscribed lecturer")
        //                 return false;
        //             }
        //         }
        //     }
        // }
        

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
            if (this.agentIsFree(si)) {     // TODO rename;
                this.freeAgentsOfGroup1.shift();
            } else {

                this.update(2, {"%currentAgent%": si.name});
 
                // first such project on si's list;
                let preferredProject: Project = this.getNextPotentialProposee(si);
                console.log("preferredProject: ", preferredProject);
                let lecturer: Lecturer = this.getProjectLecturer(preferredProject);
                console.log("lecturer: ", lecturer);

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

    abstract agentIsFree(student: Student): boolean;

    /** removeRuledOutPreferences group: */ 
    
    //abstract removeRuledOutPreferencesFromStudent(student: Student, preferredProject: Project): void;

    //abstract removeRuledOutPreferencesFromLecturer(lecturer: Lecturer, preferredProject: Project): void;
    /** end of group */ 

}