import { Agent } from "./Agent";

export interface Lecturer extends Agent {
    capacity: number;
    advising: number;
}