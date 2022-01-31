import { Project } from "./Project";

export interface Lecturer {
    name: string;
    match: Array<Project>;  // the project contains information about the lecturer so having the project be a link is enough
    ranking: Array<Project>;
    capacity: number;
    //advising: number;
}