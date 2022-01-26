import { Agent } from "../interfaces/Agent";
import { AlgorithmData } from "../interfaces/AlgorithmData";
import { MatchingAlgorithmExtension } from "./MatchingAlgorithmExtension";

export abstract class ImprovedSpaP extends MatchingAlgorithmExtension {

    constructor() {
        super();
    }

    abstract match(): AlgorithmData;

}