import { AlgorithmData } from "../interfaces/AlgorithmData";
import { Lecturer } from "../interfaces/Lecturer";
import { Project } from "../interfaces/Project";
import { Student } from "../interfaces/Student";
import { MatchingAlgorithmExtension } from "./MatchingAlgorithmExtension";

export abstract class SpaP extends MatchingAlgorithmExtension {

    

    getLecturerWorstNonEmptyProject(lk : Lecturer): Project {
        // let positionMap: Map<number, Project> = new Map();

        // for (let project of lk.ranking){
        //     console.log("WorstNonEmpty project", project);
        //     positionMap.set(this.findPositionInLecturerMatches(lk, project), project);
        // }

        // let pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        
        // while (pz.assigned.length === 0) {
        //     pz = positionMap.get(Math.max(...Array.from(positionMap.keys())));
        // }
        
        // return pz

        let lRankings = lk.ranking;

        // reverse() example from: https://www.codegrepper.com/code-examples/javascript/iterate+array+in+reverse+order++typescript
        for (let project of lRankings.reverse()){
            if (project.assigned.length > 0){
                return project;
            }
        }
        return undefined;
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
        
        if (sr.match != undefined){
            if (project.name == sr.match.name){
                sr.match = undefined;
                delete project.assigned[sr.name];
                delete project.lecturer.match[project.name];
            }
        }
    }

    /** Check Stability */
    

    assignedBlockPair(allMatches: Map<String, String>): number{
        let currProject: Project;
        let worstNonEmpty: Project = undefined;
        
        let projectTracker: number = 0;

        //let stabilityTracker: number = 0;
        let stabilityTracker: number = allMatches.size;
        console.log("Initial stabilityTracker: ", stabilityTracker);

        for (let sr of allMatches.keys()) {
            let student: Student = this.group1Agents.get(sr);
            //let studentPreferences: String[] = this.group1CurrentPreferences.get(sr);

            
            if (allMatches.get(sr) != "No Assignment"){

                projectTracker = student.ranking.indexOf(student.match);
                
                // for every project student prefers
                for (let pj: number = 0; pj < projectTracker; pj++){
                    currProject = student.ranking[pj];
                    // if project undersubscribed 
                    if (currProject.capacity < currProject.assigned.length) {
                        // and its lecturer is full
                        if (currProject.lecturer.capacity == currProject.lecturer.match.length){
                            worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer)
                            // if lecturer prefers currProject to their worst non empty
                            if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
                                console.log("Student", student.name, "assigned with full lecturer", currProject.lecturer.name, "who prefers currProject");
                                //return false;
                                stabilityTracker--;
                                console.log("stabilityTracker: ", stabilityTracker);
                            }
                        // if project and lecturer both undersubscribed
                        } else {
                            console.log("Student", student.name, "assigned with undersubscribed lecturer", currProject.lecturer.name);
                            //return false;
                            stabilityTracker--;
                            console.log("stabilityTracker: ", stabilityTracker);
                        }
                    }
                }
            }
        }
        return stabilityTracker;
    }

    unassignedBlockPair(allMatches: Map<String, String>, stabilityTracker: number): number {
        let currProject: Project;
        let worstNonEmpty: Project;
        stabilityTracker = allMatches.size;

        for (let sr of allMatches.keys()) {
            let student: Student = this.group1Agents.get(sr);

            if (allMatches.get(sr) == "No Assignment"){
                let updateTracker: boolean = false;

                // for every project in that student's list
                for (let pj: number = 0; pj < student.ranking.length; pj++){
                    currProject = this.group3Agents.get(student.ranking[pj].name);
                    // if lecturer is full
                    if (currProject.lecturer.capacity == currProject.lecturer.match.length){
                        worstNonEmpty = this.getLecturerWorstNonEmptyProject(currProject.lecturer);
                        // if currProject is preferred over worstNonEmptyProject
                        if (currProject.lecturer.ranking.indexOf(currProject) < currProject.lecturer.ranking.indexOf(worstNonEmpty)){
                            console.log("Unassigned student", student.name, "with full lecturer", currProject.lecturer.name)
                            //stabilityTracker--;
                            updateTracker = true;
                        }
                    } else if (currProject.lecturer.capacity > currProject.lecturer.match.length){
                        console.log("Unassigned student", student.name, "with undersubscribed lecturer", currProject.lecturer.name);
                        //stabilityTracker--;
                        updateTracker = true;
                    }
                }
                if (updateTracker){
                    stabilityTracker--;
                }
            }
        }
        return stabilityTracker;
    }

    checkStability(allMatches: Map <String, String>){
        let matchCount: number = allMatches.size;

        let stabilityTracker = this.assignedBlockPair(allMatches);
        stabilityTracker = this.unassignedBlockPair(allMatches, stabilityTracker);
        console.log("stabilityTracker: ", stabilityTracker, "out of", matchCount);

        let stability = this.guaranteedStability(matchCount, stabilityTracker);

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
            if (this.agentToFree(si)) {     
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

    abstract guaranteedStability(matchCount: number, stabilityTracker: number);

    /** removeRuledOutPreferences group: */ 
    
    //abstract removeRuledOutPreferencesFromStudent(student: Student, preferredProject: Project): void;

    //abstract removeRuledOutPreferencesFromLecturer(lecturer: Lecturer, preferredProject: Project): void;
    /** end of group */ 

}