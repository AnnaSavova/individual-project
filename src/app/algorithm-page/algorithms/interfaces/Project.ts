import { Lecturer } from "./Lecturer";
import { Student } from "./Student";

export interface Project {

    name : string;
    lecturer: Lecturer; // lecturer who ofers the project
    capacity : number; // how many students can be assigned to the project
    assigned : Array<Student>;  // list of students assigned to the project.

}