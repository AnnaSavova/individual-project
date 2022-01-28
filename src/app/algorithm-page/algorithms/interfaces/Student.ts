import { Project } from "./Project";

export interface Student {
    name: string;
    match: Array<Project>;  // the project contains information about the lecturer so having the project be a link is enough
    ranking: Array<Project>;
    promoted: boolean

}