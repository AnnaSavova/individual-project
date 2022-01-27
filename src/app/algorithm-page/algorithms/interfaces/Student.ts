import { Lecturer } from "./Lecturer";
import { Project } from "./Project";

export interface Student {
    name: string;
    match: Array<[String,String]>;
    ranking: Array<Project>;
    promoted: boolean

}