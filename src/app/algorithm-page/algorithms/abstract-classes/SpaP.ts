import { AlgorithmData } from "../interfaces/AlgorithmData";
import { Lecturer } from "../interfaces/Lecturer";
import { Project } from "../interfaces/Project";
import { Student } from "../interfaces/Student";
import { MatchingAlgorithmExtension } from "./MatchingAlgorithmExtension";

export abstract class SpaP extends MatchingAlgorithmExtension {

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

            let pj = si.ranking[0];     // first project on si's list
            let lk = pj.lecturer;       // lecturer who offers pj
            let pz = lk.ranking[-1];    // worst project on lk's list


            // if all potential proposees are gone, remove 
            if (si.ranking.length <= 0 || !this.getNextPotentialProposee(si)) {
                this.freeAgentsOfGroup1.shift();
            } else {

                this.update(2, {"%currentAgent%": si.name});

                // first such project on si's list;
                let preferredProject: Project = this.getNextPotentialProposee(si);


                let agentLastChar = this.getLastCharacter(si.name);
                let proposeeLastChar = this.getLastCharacter(preferredProject.name);
                let lecturerLastChar = this.getLastCharacter(preferredProject.lecturer.name)

                this.currentlySelectedAgents.push(proposeeLastChar);
                this.relevantPreferences.push(proposeeLastChar);

                this.changePreferenceStyle(this.group1CurrentPreferences, agentLastChar, this.originalGroup1CurrentPreferences.get(agentLastChar).findIndex(project => project == this.getLastCharacter(preferredProject.name)), "red");
                //this.changePreferenceStyle(this.group2CurrentPreferences, proposeeLastChar, this.findPositionInMatches(si, preferredProject), "red");

                let redLine = [agentLastChar, proposeeLastChar, "red"];
                this.currentLines.push(redLine);

                this.update(3, {"%currentAgent%": si.name, "%preferredProject%": preferredProject.name});

                // if h is fully subscribed, then break the assignment of the worst resident of that hospital
                this.breakAssignment(si, preferredProject);
        
                this.provisionallyAssign(si, preferredProject);
        
                //this.removeRuledOutPreferences(si, preferredProject);
        
                if (this.shouldContinueMatching(si)) {
                    this.freeAgentsOfGroup1.shift();
                }  
            }
        }

        this.currentlySelectedAgents = [];
        this.relevantPreferences = [];
        // a stable matching has been found
        this.update(12);

        return;
    }


    abstract getNextPotentialProposee(currentAgent: Student): Project;

    abstract shouldContinueMatching(currentAgent: Student): boolean;

    abstract provisionallyAssign(currentAgent: Student, preferredProject: Project): void;

    /** removeRuledOutPreferences group: */ 
    
    abstract removeRuledOutPreferencesFromStudent(currentAgent: Student, preferredProject: Project): void;

    abstract removeRuledOutPreferencesFromLecturer(currentAgent: Lecturer, preferredProject: Project): void;
    /** end of group */ 

    abstract breakAssignment(currentAgent: Student | Lecturer, preferredProject: Project): void;

}