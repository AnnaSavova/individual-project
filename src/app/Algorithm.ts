import { MatchingAlgorithm } from "./algorithm-page/algorithms/abstract-classes/MatchingAlgorithm";
import { SpaP } from "./algorithm-page/algorithms/abstract-classes/SpaP";

export interface Algorithm {
    id: string;
    name: string;
    orientation: Array<string>;
    equalGroups: boolean;
    algorithm: string;
    service: MatchingAlgorithm | SpaP;
    description: string;
    helpTextMap: Object; // map<number, string>
    code: Array<string>;
}