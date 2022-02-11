import { AlgorithmData } from "../interfaces/AlgorithmData";
import { Lecturer } from "../interfaces/Lecturer";
import { Project } from "../interfaces/Project";
import { Step } from "../interfaces/Step";
import { Student } from "../interfaces/Student";

export abstract class MatchingAlgorithmExtension {

    abstract group1Name: string; // students in SpaP and ImprovedSpaP
    abstract group2Name: string; // lecturers in SpaP and ImprovedSpaP
    abstract group3Name: string; // projects in SpaP and ImprovedSpaP

    numberOfAgents: number;
    numberOfGroup2Agents: number;   // TODO Breaks here maybe
    numberOfGroup3Agents: number;

    freeAgentsOfGroup1: Array<String>;

    group1Agents: Map<String, Student> = new Map();
    group2Agents: Map<String, Lecturer> = new Map();
    group3Agents: Map<String, Project> = new Map();

    algorithmData: AlgorithmData = {
        commands: new Array(),
        descriptions: new Array()
    };

    currentLine: Array<string> = [];

    originalGroup1CurrentPreferences: Map<String, Array<String>> = new Map();
    originalGroup2CurrentPreferences: Map<String, Array<String>> = new Map();

    group1CurrentPreferences: Map<String, Array<String>> = new Map();
    group2CurrentPreferences: Map<String, Array<String>> = new Map();
    currentlySelectedAgents: Array<string> = [];
    currentLines: Array<Array<string>> = [];

    algorithmSpecificData: Object = {};

    relevantPreferences: Array<string> = [];

    stable: boolean = false;

    constructor() { }

    initialise(numberOfAgents: number, numberOfGroup2Agents: number = numberOfAgents, numberOfGroup3Agents:number) {
        this.freeAgentsOfGroup1 = [];

        this.group1Agents = new Map(); // students group in SpaP and ImprovedSpaP

        this.group2Agents = new Map(); // lecturers group in SpaP and ImprovedSpaP
        this.group3Agents = new Map(); // projects group in SpaP and ImprovedSpaP

        this.algorithmData = {
            commands: new Array(),
            descriptions: new Array()
        };
    
        this.currentLine = [];
    
        this.group1CurrentPreferences = new Map();
        this.group2CurrentPreferences = new Map();
        this.currentlySelectedAgents = [];
        this.currentLines = [];
    
        this.algorithmSpecificData = {};
    
        this.relevantPreferences = [];

        this.numberOfAgents = numberOfAgents;
        this.numberOfGroup2Agents = numberOfGroup2Agents;
        this.numberOfGroup3Agents = numberOfGroup3Agents;

        this.stable = false;
    }

    generateAgents() {
        // generate students
        for (let i = 1; i < this.numberOfAgents + 1; i++) {
            let group1AgentName = this.group1Name + i;

            this.group1Agents.set(group1AgentName, {
                name: group1AgentName,
                match: new Array(),
                ranking: new Array(),
                promoted: false
            });

            this.freeAgentsOfGroup1.push(group1AgentName);

        }

        // generate lecturers
        let currentLetter = 'A';

        for (let i = 1; i < this.numberOfGroup2Agents + 1; i++) {
            let group2AgentName = this.group2Name + currentLetter;

            this.group2Agents.set(group2AgentName, {
                name: group2AgentName,
                match: new Array(),
                ranking: new Array(),
                capacity: Math.floor(Math.random() * (3 - 1 + 1) + 1),    // generate random capacity for each lecturer. TO CHANGE.
                //advising: 0
            });

            currentLetter = String.fromCharCode((((currentLetter.charCodeAt(0) + 1) - 65 ) % 26) + 65);

        }

        // generate projects
        let currLet = 'a'

        for (let i = 1; i < this.numberOfGroup3Agents + 1; i++) {
            let group3AgentName = this.group3Name + currLet;

            // from: https://stackoverflow.com/questions/42739256/how-get-random-item-from-es6-map-or-set
            let selectedLecturer: Lecturer = Array.from(this.group2Agents.values())[Math.floor( 0.2 + Math.random() * this.group2Agents.size)];

            // debug console.log("group2agents: ", this.group2Agents, "selectedLecturer: ", selectedLecturer);
            
            this.group3Agents.set(group3AgentName, {
                name: group3AgentName,
                lecturer: selectedLecturer,    // generates a lecturer for the project
                capacity: 1,
                assigned: new Array()
            });
            console.log("group3agentName: ", group3AgentName, "group3Agent: ", this.group3Agents.get(group3AgentName));
            currLet = String.fromCharCode((((currLet.charCodeAt(0) + 1) - 65 ) % 26) + 65);
        }
    }


    // generates rankings for all agents
    // changes agent.ranking
    generatePreferences(): void {
        
        for (let student of Array.from(this.group1Agents.values())) {
            let agent1Rankings = Array.from((new Map(this.group3Agents)).values());
            this.shuffle(agent1Rankings);
            this.group1Agents.get(student.name).ranking = agent1Rankings;
        }

        for (let lecturer of Array.from(this.group2Agents.values())) {
            let agent2Rankings = Array.from((new Map(this.group3Agents)).values());
            this.shuffle(agent2Rankings);
            this.group2Agents.get(lecturer.name).ranking = agent2Rankings;
        }

    }

    populatePreferences(preferences: Map<String, Array<String>>): void {
        console.log("populatePreferences:", preferences);
        let tempCopyList: Project[];

        for (let student of Array.from(this.group1Agents.keys())) {
            let sv = this.getLastCharacter(String(student));
            console.log("sv: ", sv, "student: ", student);
            tempCopyList = [];
            for (let preferenceAgent of preferences.get(sv)) {  // preferences.get is not a function or its return value is not iterable
                tempCopyList.push(this.group3Agents.get(this.group3Name + preferenceAgent));
            }
            this.group1Agents.get(student).ranking = tempCopyList;
        }

        for (let lecturer of Array.from(this.group3Agents.keys())) {
            tempCopyList = [];
            for (let preferenceAgent of preferences.get(this.getLastCharacter(String(lecturer)))) {
                tempCopyList.push(this.group3Agents.get(this.group3Name + preferenceAgent));
            }
            this.group2Agents.get(lecturer).ranking = tempCopyList;
        }
    
        console.log(this.group1Agents); //TODO : potentially remove later after testing
        console.log(this.group2Agents); //TODO : potentially remove later after testing
        console.log(this.group3Agents); //TODO : potentially remove later after testing

    }

    // FROM: https://javascript.info/task/shuffle
    shuffle(array: Array<Object>) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      
          // swap elements array[i] and array[j]
          // we use "destructuring assignment" syntax to achieve that
          // you'll find more details about that syntax in later chapters
          // same can be written as:
          // let t = array[i]; array[i] = array[j]; array[j] = t
          [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getRankings(agents: Map<String, (Student | Lecturer)>): Map<String, Array<String>>{
        let rankList : Map<String, Array<String>> = new Map()

        for (let agent of Array.from(agents.values())){
            let preferences = [];

            for (let mapping of agent.ranking){
                preferences.push(mapping.name.slice(mapping.name.length - 1));
            }

            let agentName: string = agent.name.slice(agent.name.length - 1);

            rankList.set(agentName, preferences);
        }
        return rankList;
    }


    clone(mapIn: Map<String, Array<String>>): Map<String, Array<String>> {
        let mapCloned: Map<String, Array<String>> = new Map<String, Array<String>>();
    
        mapIn.forEach((str: Array<String>, key: String, mapObj: Map<String, Array<String>>) => {
          
          //products.slice(0) clone array
          mapCloned.set(key, str.slice(0));
        });
        return mapCloned;
    }


    update(step: number, stepVariables?: Object): void {
        let currentStep: Step = {
            lineNumber: step,
            freeAgents: Object.assign([], this.freeAgentsOfGroup1),
            matches: new Map(),
            stepVariables: stepVariables,
            group1CurrentPreferences: this.clone(this.group1CurrentPreferences),
            group2CurrentPreferences: this.clone(this.group2CurrentPreferences),
            currentlySelectedAgents: JSON.parse(JSON.stringify(this.currentlySelectedAgents)),
            currentLines: JSON.parse(JSON.stringify(this.currentLines)),
            algorithmSpecificData: JSON.parse(JSON.stringify(this.algorithmSpecificData)),
            relevantPreferences: JSON.parse(JSON.stringify(this.relevantPreferences)),
        }

        this.algorithmData.commands.push(currentStep);
    }

    getMatches(): Map<String, Array<String>> {
        let matches: Map<String, Array<String>> = new Map();

        for (let i = 1; i < this.numberOfAgents + 1; i++) {
            let agentName: string = this.group1Name + i.toString();
            let student: Student = this.group1Agents.get(agentName);
            console.log("group1Agent: ", this.group1Agents, "agentName: ", agentName, "student: ", student);
            let matchList: Array<String> = new Array();

            for (let match of student.match) {  // TODO: student is undefined
                matchList.push(match.name);
            }
            matches.set(student.name, matchList);
        }
        return matches;
    }

    /** findPositionInMatches group: */ 

    findPositionInStudentMatches(currentAgent: Student, agentToFind: Project): number {
        let position: number = -1;

        for (let i = 0; i < agentToFind.assigned.length ; i++){
            let studentName = agentToFind.assigned[i].name
            if (currentAgent.name === studentName){
                position = currentAgent.ranking.findIndex((person: { name: string; }) => person.name == studentName);
                return position;
            }
        }
        throw new Error("No such student found");
    }

    findPositionInLecturerMatches(currentAgent: Lecturer, agentToFind: Project): number {
        let position = currentAgent.ranking.findIndex((person: { name: string; }) => person.name == agentToFind.lecturer.name);
        return position;
    }
    /** end of group */
    

    /** findPositionInOriginalMatches group: */ 

    findPositionInOriginalStudentMatches(currentAgent: Student, agentToFind: Project) {
        let originalPreferences = this.originalGroup1CurrentPreferences.get(currentAgent.name[currentAgent.name.length - 1]);
        let position: number = originalPreferences.indexOf(agentToFind.name[agentToFind.name.length - 1]);
        return position;
    }

    findPositionInOriginalLecturerMatches(currentAgent: Lecturer, agentToFind: Project) {
        let originalPreferences = this.originalGroup2CurrentPreferences.get(currentAgent.name[currentAgent.name.length - 1]);
        let position: number = originalPreferences.indexOf(agentToFind.name[agentToFind.name.length - 1]);
        return position;
    }
    /** end of group */


    getLastCharacter(name: string) {
        return name.slice(name.length - 1);
    }

    checkArrayEquality(a: Array<string>, b: Array<string>) {
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) { return false; }
        }
        return true;
      }


    // used to remove elements from currentLines
    removeArrayFromArray(a: Array<Array<string>>, b: Array<string>) {
        let arrayPositionCounter: number = 0;
        for (let subArray of a) {
          if (this.checkArrayEquality(subArray, b)) {
            a.splice(arrayPositionCounter, 1);
          }
          arrayPositionCounter++;
        }
      }


    // #53D26F (green)
    // #C4C4C4 (grey)
    changePreferenceStyle(preferenceList: Map<String, Array<String>>, person: string, position: number, style: string) {

        let currentAgent: string = "";

        if (preferenceList.get(person)[position].includes("#")) {
            currentAgent = preferenceList.get(person)[position].charAt(preferenceList.get(person)[position].length - 2);
        } else {
            currentAgent = preferenceList.get(person)[position].charAt(preferenceList.get(person)[position].length - 1);
        }

        if (style == "green") {
            style = "#53D26F";
        } else if (style == "red") {
            style = "#EB2A2A";
        } else if (style == "grey") {
            style = "#C4C4C4";
        } else if (style == "black") {
            style = "#000000";
        }

        preferenceList.get(person)[position] = "{" + style + currentAgent + "}";

    }

    changeAgentStyle(person: string, style: string) {
        let currentAgent: string = "";

        //if (person[position].includes("#")) {
        //    currentAgent = person[position].charAt(person[position].length - 2);
        //} else {
        //    currentAgent = person[position].charAt(person[position].length - 1);
        //}

        if (person.includes('#')){
            currentAgent = person.charAt(person.length - 2);
        } else {
            currentAgent = person.charAt(person.length - 1);
        }

        if (style == "green") {
            style = "#53D26F";
        } else if (style == "red") {
            style = "#EB2A2A";
        } else if (style == "grey") {
            style = "#C4C4C4";
        } else if (style == "black") {
            style = "#000000";
        }

        person = "{" + style + currentAgent + "}";
    }


    /** getLastMatch group: */

    getLastStudentMatch(currentAgent: String, agentMatches: Array<String>): number {
        let furthestIndex: number = 0;
        for (let matchAgent of agentMatches) {
            let matchPosition = this.findPositionInStudentMatches(this.group1Agents.get(currentAgent), this.group3Agents.get(matchAgent));
            if (matchPosition > furthestIndex) {
                furthestIndex = matchPosition;
            }
        }
        return furthestIndex;
    }

    getLastLecturerMatch(currentAgent: String, agentMatches: Array<String>): number {
        let furthestIndex: number = 0;
        for (let matchAgent of agentMatches) {
            let matchPosition = this.findPositionInLecturerMatches(this.group2Agents.get(currentAgent), this.group3Agents.get(matchAgent));
            if (matchPosition > furthestIndex) {
                furthestIndex = matchPosition;
            }
        }
        return furthestIndex;
    }
    /** end of group */

    run(numberOfAgents: number, numberOfGroup2Agents: number = numberOfAgents, preferences: Map<String, Array<String>>, numberOfGroup3Agents: number): AlgorithmData {
        if (numberOfGroup2Agents != numberOfAgents || numberOfGroup3Agents != numberOfAgents) {
            this.initialise(numberOfAgents, numberOfGroup2Agents, numberOfGroup3Agents);
        } else {
            this.initialise(numberOfAgents, numberOfGroup2Agents, numberOfAgents); // order is student-lecturer-project
        }
        
        this.generateAgents();

        if (preferences && preferences.size > 0) {
            this.populatePreferences(preferences);
        } else {
            this.generatePreferences();
        }

        this.group1CurrentPreferences = this.getRankings(this.group1Agents);
        this.originalGroup1CurrentPreferences = this.getRankings(this.group1Agents);

        this.group2CurrentPreferences = this.getRankings(this.group2Agents);
        this.originalGroup2CurrentPreferences = this.getRankings(this.group2Agents);

        this.match();   //TODO breaks here maybe

        this.stable = this.checkStability(this.getMatches());   // TODO: undefined

        if (!this.stable) {
            console.log("Matching is not stable!");
            return undefined;
        }

        return this.algorithmData;

    }

    abstract match(): AlgorithmData;

    // check if no unmatched pair like each other more than their current partners
    abstract checkStability(allMatches: Map<String, Array<String>>): boolean;

}