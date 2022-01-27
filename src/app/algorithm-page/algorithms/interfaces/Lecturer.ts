import { Project } from "./Project";

export interface Lecturer {
    name: String;
    ranking: Array<Project>;
    capacity: number;
    advising: number;
}