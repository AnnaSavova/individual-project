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

    match(): AlgorithmData {

        // assign each student to be free;
        this.update(1);

        while (this.freeAgentsOfGroup1.length > 0) {

            this.currentlySelectedAgents = [];
            this.relevantPreferences = [];

            // while (some student si is unassigned) and (si's preference list is non-empty) {
            let si = this.group1Agents.get(this.freeAgentsOfGroup1[0]);   // current student si
            this.currentlySelectedAgents.push(this.getLastCharacter(si.name));
            this.relevantPreferences.push(this.getLastCharacter(si.name));


            // if all potential proposees are gone, remove 
            if (si.ranking.length <= 0 || !this.getNextPotentialProposee(si)) {
                this.freeAgentsOfGroup1.shift();
            } else {

                this.update(2, {"%currentAgent%": si.name});

                // first such project on si's list;
                let preferredProject: Project = this.getNextPotentialProposee(si);
                let lecturer: Lecturer = this.getProjectLecturer(preferredProject);

                let agentLastChar = this.getLastCharacter(si.name);
                let proposeeLastChar = this.getLastCharacter(preferredProject.name);
                let lecturerLastChar = this.getLastCharacter(lecturer.name)

                this.currentlySelectedAgents.push(proposeeLastChar);
                this.relevantPreferences.push(proposeeLastChar);

                this.changePreferenceStyle(this.group1CurrentPreferences, agentLastChar, this.originalGroup1CurrentPreferences.get(agentLastChar).findIndex(project => project == this.getLastCharacter(preferredProject.name)), "red");
                this.changeAgentStyle(lecturerLastChar, "red")

                let redLine = [agentLastChar, proposeeLastChar, lecturerLastChar, "red"];
                this.currentLines.push(redLine);

                this.update(3, {"%currentAgent%": si.name, "%preferredProject%": preferredProject.name});

                // student applies to project
                this.applyTo(si, preferredProject, lecturer); 
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

    abstract provisionallyAssign(student: Student, preferredProject: Project, worstProject: Project): void;

    /** removeRuledOutPreferences group: */ 
    
    //abstract removeRuledOutPreferencesFromStudent(student: Student, preferredProject: Project): void;

    //abstract removeRuledOutPreferencesFromLecturer(lecturer: Lecturer, preferredProject: Project): void;
    /** end of group */ 

}