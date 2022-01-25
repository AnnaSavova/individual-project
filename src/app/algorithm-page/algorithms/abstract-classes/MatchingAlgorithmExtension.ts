import { Agent } from "../interfaces/Agent";
import { AlgorithmData } from "../interfaces/AlgorithmData";
import { Step } from "../interfaces/Step";

// NEEDS MASSIVE EDITING

export abstract class MatchingAlgorithmExtension {

    abstract group1Name: string; // students in SpaP and ImprovedSpaP
    abstract group2Name: string; // projects in SpaP and ImprovedSpaP
    abstract group3Name: string; // lecturers in SpaP and ImprovedSpaP

    numberOfAgents: number;
    numberOfGroup2Agents: number;
    numberOfGroup3Agents: number;

    freeAgentsOfGroup1: Array<String>;

    group1Agents: Map<String, Agent> = new Map();
    group2Agents: Map<String, Agent> = new Map();
    group3Agents: Map<String, Agent> = new Map();

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
        for (let i = 1; i < this.numberOfAgents + 1; i++) {
            let group1AgentName = this.group1Name + i;

            this.group1Agents.set(group1AgentName, {
                name: group1AgentName,
                match: new Array(),
                ranking: new Array()
            });

            this.freeAgentsOfGroup1.push(group1AgentName);

        }

        let currentLetter = 'A';

        for (let i = 1; i < this.numberOfGroup3Agents + 1; i++) {
            let group2AgentName = this.group2Name + currentLetter;

            this.group2Agents.set(group2AgentName, {
                name: group2AgentName,
                match: new Array(),
                ranking: new Array()
            });

            currentLetter = String.fromCharCode((((currentLetter.charCodeAt(0) + 1) - 65 ) % 26) + 65);

        }

        let currLet = 'a'
        for (let i = 1; i < this.numberOfAgents + 1; i++) {
            let group3AgentName = this.group2Name + currLet;

            this.group3Agents.set(group3AgentName, {
                name: group3AgentName,
                match: new Array(),
                ranking: new Array()
            });

            this.freeAgentsOfGroup1.push(group3AgentName);
            currLet = String.fromCharCode((((currLet.charCodeAt(0) + 1) - 65 ) % 26) + 65);
        }
    }


    // generates rankings for all agents
    // changes agent.ranking
    generatePreferences(): void {
        
        for (let agent of Array.from(this.group1Agents.values())) {
            let agent1Rankings = Array.from((new Map(this.group3Agents)).values());
            this.shuffle(agent1Rankings);
            this.group1Agents.get(agent.name).ranking = agent1Rankings;
        }

        for (let agent of Array.from(this.group2Agents.values())) {
            let agent2Rankings = Array.from((new Map(this.group1Agents)).values());
            this.shuffle(agent2Rankings);
            this.group2Agents.get(agent.name).ranking = agent2Rankings;
        }

    }

    // Further Investigation needed

    populatePreferences(preferences: Map<String, Array<String>>): void {
        // console.log(preferences);
        let tempCopyList: Agent[];

        for (let agent of Array.from(this.group1Agents.keys())) {
            tempCopyList = [];
            // this.group1Agents.get(agent).ranking = preferences.get(this.getLastCharacter(String(agent)));
            for (let preferenceAgent of preferences.get(this.getLastCharacter(String(agent)))) {
                tempCopyList.push(this.group3Agents.get(this.group3Name + preferenceAgent));
            }
            this.group1Agents.get(agent).ranking = tempCopyList;
        }

        for (let agent of Array.from(this.group3Agents.keys())) {
            tempCopyList = [];
            // this.group1Agents.get(agent).ranking = preferences.get(this.getLastCharacter(String(agent)));
            for (let preferenceAgent of preferences.get(this.getLastCharacter(String(agent)))) {
                tempCopyList.push(this.group3Agents.get(this.group3Name + preferenceAgent));
            }
            this.group2Agents.get(agent).ranking = tempCopyList;
        }
    
        console.log(this.group1Agents);
        console.log(this.group2Agents); 
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


    // TO DO might need changes 

    getGroupRankings(agents: Map<String, Agent>): Map<String, Array<String>> {

        let matches: Map<String, Array<String>> = new Map();

        for (let agent of Array.from(agents.values())) {
            let preferenceList = [];
            
            for (let match of agent.ranking) {
                preferenceList.push(match.name.slice(match.name.length - 1));
            }

            let identifier: string = agent.name.slice(agent.name.length - 1);
            // console.log()

            matches.set(identifier, preferenceList);

        }

        return matches;

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


    // TODO might need to change

    getMatches(): Map<String, Array<String>> {
        let matches: Map<String, Array<String>> = new Map();

        for (let i = 1; i < this.numberOfGroup2Agents + 1; i++) {
            let agentName: string = this.group2Name + String.fromCharCode(i + 64);
            let agent: Agent = this.group2Agents.get(agentName);

            let matchList: Array<String> = new Array();

            for (let match of agent.match) {
                matchList.push(match.name);
            }

            matches.set(agent.name, matchList);

        }

        return matches;

    }


    findPositionInMatches(currentAgent: Agent, agentToFind: Agent): number {
        let position: number = currentAgent.ranking.findIndex((agent: { name: string; }) => agent.name == agentToFind.name);
        return position;
    }

    findPositionInOriginalMatches(currentAgent: Agent, agentToFind: Agent) {
        let originalPreferences = this.originalGroup1CurrentPreferences.get(currentAgent.name[currentAgent.name.length - 1]);
        let position: number = originalPreferences.indexOf(agentToFind.name[agentToFind.name.length - 1]);
        return position;
    }

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
    // changePreferenceStyle(preferenceList: Object, person: string, position: number, style: string) {
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


    // TODO : edit with Dr Sofiat's papers
    
    // check if no unmatched pair like each other more than their current partners
    checkStability(allMatches: Map<String, Array<String>>): boolean {
        let stability = true;

        // for all women
        for (let agent of allMatches.keys()) {
            let agentMatches = allMatches.get(agent);

            // if agent has matches
            if (agentMatches.length > 0) {

                // find the position of the last ranked match (for Stable Marriage this will be the only match)
                let lastAgentPosition = this.getLastMatch(agent, agentMatches);
                let agentPreferences: Array<Agent> = this.group2Agents.get(agent).ranking;

                // for every agent, x, better than match, check:
                //   - if x isn't one of the matches (for HR), then
                //      - check if x likes currentAgent more than their match
                //          - if yes, stability = false
                //          - if no, stability = true
                for (let i = lastAgentPosition - 1; i >= 0; i--) {
                    if (!agentMatches.includes(agentPreferences[i].name)) {
                        let matchPosition = this.findPositionInOriginalMatches(agentPreferences[i], agentPreferences[i].match[0]);
                        let currentAgentPosition = this.findPositionInOriginalMatches(agentPreferences[i], this.group2Agents.get(agent));
                        if (currentAgentPosition < matchPosition) {
                            stability = false;
                        }
                    }
                }
            }
        }
        return stability;
    }

    getLastMatch(currentAgent: String, agentMatches: Array<String>): number {
        let furthestIndex: number = 0;
        for (let matchAgent of agentMatches) {
            let matchPosition = this.findPositionInMatches(this.group2Agents.get(currentAgent), this.group1Agents.get(matchAgent));
            if (matchPosition > furthestIndex) {
                furthestIndex = matchPosition;
            }
        }
        return furthestIndex;
    }


    abstract match(): AlgorithmData;

    run(numberOfAgents: number, numberOfGroup2Agents: number = numberOfAgents, numberOfGroup3Agents: number, preferences1: Map<String, Array<String>>, preferences2: Map<String, Array<String>>): AlgorithmData {
        if (numberOfGroup2Agents != numberOfAgents || numberOfGroup3Agents != numberOfAgents) {
            this.initialise(numberOfAgents, numberOfGroup2Agents, numberOfGroup3Agents);
        } else {
            this.initialise(numberOfAgents, numberOfGroup2Agents, numberOfAgents); // order is student-lecturer-project
        }
        
        this.generateAgents();

        if (preferences1) {
            this.populatePreferences(preferences1);
        } else {
            this.generatePreferences();
        }

        if (preferences2) {
            this.populatePreferences(preferences2);
        } else {
            this.generatePreferences();
        }

        this.group1CurrentPreferences = this.getGroupRankings(this.group1Agents);
        this.originalGroup1CurrentPreferences = this.getGroupRankings(this.group1Agents);

        this.group2CurrentPreferences = this.getGroupRankings(this.group2Agents);
        this.originalGroup2CurrentPreferences = this.getGroupRankings(this.group2Agents);

        this.match();

        this.stable = this.checkStability(this.getMatches());

        if (!this.stable) {
            console.log("Matching is not stable!");
            return undefined;
        }

        return this.algorithmData;

    }

}