import { MatchingAlgorithm } from "./algorithm-page/algorithms/abstract-classes/MatchingAlgorithm";
import { MatchingAlgorithmExtension } from "./algorithm-page/algorithms/abstract-classes/MatchingAlgorithmExtension";

export interface Algorithm {
    id: string;
    name: string;
    orientation: Array<string>;
    equalGroups: boolean;
    algorithm: string;
    service: MatchingAlgorithm | MatchingAlgorithmExtension;
    description: string;
    helpTextMap: Object; // map<number, string>
    code: Array<string>;
}