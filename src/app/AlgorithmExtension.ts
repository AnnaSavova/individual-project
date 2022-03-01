import { MatchingAlgorithm } from "./algorithm-page/algorithms/abstract-classes/MatchingAlgorithm";
import { MatchingAlgorithmExtension } from "./algorithm-page/algorithms/abstract-classes/MatchingAlgorithmExtension";

export interface AlgorithmExtension {
    id: string;
    name: string;
    orientation: Array<string>;
    equalGroups: boolean;
    algorithm: string;
    service: MatchingAlgorithmExtension;
    description: string;
    helpTextMap: Object; // map<number, string>
    code: Array<string>;
}