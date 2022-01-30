import { Injectable } from '@angular/core';
import { Algorithm } from './Algorithm';
import { HrResidentEgsService } from './algorithm-page/algorithms/algorithm-services/hr-resident-egs/hr-resident-egs.service';
import { EgsStableMarriageService } from './algorithm-page/algorithms/algorithm-services/smp-man-egs/egs-stable-marriage.service';
import { GsStableMarriageService } from './algorithm-page/algorithms/algorithm-services/smp-man-gs/gs-stable-marriage.service';
import { SpapImprovedEgsService } from './algorithm-page/algorithms/algorithm-services/spap-improved-egs/spap-improved-egs.service';
import { SpapOrigEgsService } from './algorithm-page/algorithms/algorithm-services/spap-orig-egs/spap-orig-egs.service';


// ------------------------------------------------------- ALGORITHM TEMPLATE

// [
//   "smp-man-egs", {
//     id: "smp-man-egs",
//     name: "Stable Marriage Problem",
//     orientation: ["Man", "Woman"],
//     algorithm: "Extended Gale-Shapley Stable Matching",
//     service: null,
//     description: "The stable marriage problem is the problem of finding a stable matching between two equally sized sets of elements. In this case: <b>men and women</b>.<br><br>To do this, the Extended Gale-Shapley Stable Marriage algorithm is used.",
//     helpTextMap: {

//     },
//   }
// ],

// -------------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class AlgorithmRetrievalService {

  currentAlgorithm: Algorithm;

  numberOfGroup1Agents: number = 5;
  numberOfGroup2Agents: number = 5;
  numberOfGroup3Agents: number = 5;

  mapOfAvailableAlgorithms: Map<String, Algorithm> = new Map([
    [
      "smp-man-gs", {
        id: "smp-man-gs",
        name: "Stable Marriage Problem",
        orientation: ["Man", "Woman"],
        equalGroups: true,
        algorithm: "Gale-Shapley Stable Matching",
        service: this.gsStableMarriageService,
        description: "The stable marriage problem is the problem of finding a stable matching between two equally sized sets of elements. In this case: <b>men and women</b>.<br><br>To do this, the Gale-Shapley Stable Marriage algorithm is used.",
        helpTextMap: {
          1: "Ensure there are no pre-existing matches between men and women",
          2: "While there is still a man without a match, select the first one (%man%)",
          3: "%woman% is selected as %man%'s most preferred woman who he has not yet proposed to",
          4: "Checking to see if %woman% has a match",
          5: "%woman% was free, so matching her with %man%",
          6: "%woman% is currently matched to %match%, so can't instantly engage %woman% and %man%",
          7: "Checking if %woman% likes %match% more than %man%",
          8: "%woman% likes %man% (current proposer) more than %match% (current match) so free %match% and engage %woman% and %man%",
          9: "%woman% likes %match% more than %man%",
          10: "No change to anyone's matches",
          11: "A stable matching has been generated."
        },
        code: [
          "set each person to be free;",
          "while some man m is free do:",
          "\tw = next most preferred woman on m’s list;",
          "\tif w is free then",
          "\t\tassign m to w;",
          "\telse",
          "\t\tif w prefers m to her current partner m' then",
          "\t\t\tassign m to w to be engaged and set m' to be free;",
          "\t\telse",
          "\t\t\tw rejects m’s proposal and remains with m';",
          "the stable matching consists of all n engagements"
        ]
      }
    ],

    [
      "smp-man-egs", {
        id: "smp-man-egs",
        name: "Stable Marriage Problem",
        orientation: ["Man", "Woman"],
        equalGroups: true,
        algorithm: "Extended Gale-Shapley Stable Matching",
        service: this.egsStableMarriageService,
        description: "The stable marriage problem is the problem of finding a stable matching between two equally sized sets of elements. In this case: <b>men and women</b>.<br><br>To do this, the Extended Gale-Shapley Stable Marriage algorithm is used.",
        helpTextMap: {
          1: "Set all men and women to have no engagements",
          2: "While there are some men who are not engaged, select the next one (%currentAgent%)",
          3: "%potentialProposee% is selected as %currentAgent%'s most preferred woman who he has not yet proposed to",
          4: "Check if %woman% is currently engaged to someone",
          5: "%woman% is engaged to %currentPartner%, so break the engagement between them",
          6: "%woman% is not engaged, so continue with algorithm",
          7: "Engage %man% and %woman%",
          8: "Select each man with a worse preference ranking than %man% on %woman%\'s list",
          9: "%nextWorstMan% is chosen as the next worst man on %woman%\'s preference list",
          10: "Remove %nextWorstMan% and %woman% from each other\'s lists",
          11: "All men worse than %man% on %woman%\'s preference list have been removed",
          12: "A stable matching between men and women has been found",
        },
        code: [
          "set each person to be free;",
          "while some man m is free {",
          "\tw = first woman on m's list",
          "\tif w is currently engaged to someone {",
          "\t\tbreak engagement between w and w's current partner",
          "\t}",
          "\tprovisionally engage m and w",
          "\tfor each successor m'' of m on w's list {",
          "\t\tm'' = next worst man on w's preference list",
          "\t\tremove m'' from w's preference list and vice versa",
          "\t}",
          "}"   // a stable matching between men and women has been found
        ]
      }
    ],

    [
      "hr-resident-egs", {
        id: "hr-resident-egs",
        name: "Hospitals/Residents Problem",
        orientation: ["Resident", "Hospital"],
        equalGroups: false,
        algorithm: "Extended Gale-Shapley Stable Matching",
        service: this.HrResidentEgsService,
        description: "The Hospitals/Residents Problem is the problem of finding a stable matching between a set of <b>hospitals and residents</b>, where a hospital can take multiple residents.<br><br>This is the <b>resident-oriented</b> version of the algorithm, so <b>residents will propose to hospitals</b>.<br><br>To do this, the Extended Gale-Shapley Stable Marriage algorithm is used.",
        helpTextMap: {
          1: "Clear the matches of all residents and hospitals",
          2: "The next resident who doesn't have a match and still has some hospitals in their preference list is selected (%currentAgent%\)",
          3: "The first hospital on %currentAgent%\'s preference list is selected (%potentialProposee%)",
          4: "Check if %hospital% is currently full: is it already matched with %capacity% resident(s)? If not, provisionally assign %resident% to %hospital%",
          5: "%hospital%'s number of residents is equal to its max capacity, so choose the worst resident assigned to %hospital% (%worstResident%)",
          6: "Clear the match between %hospital% and %worstResident%",
          7: "Assign %resident% to %hospital%",
          8: "Check if %hospital% is full after assigning %resident% to %hospital%",
          9: "%hospital% is fully subscribed, so choose the worst resident assigned to them (%worstResident%) and remove each successor from %hospital%'s preference list",
          10: "%nextResident% is chosen as the next resident to be removed from %hospital%'s list",
          11: "Remove %nextResident% from %hospital%'s list",
          12: "A stable matching between residents and hospitals has been found",
        },
        code: [
          "set each hospital and resident to be completely free;",
          "while (some resident r is free) and (r has a nonempty list)",
          "\th := first hospital on r's list",
          "\tif h is fully subscribed then",
          "\t\tr' := worst resident provisionally assigned to h",
          "\t\tassign r' to be free (clear match)",
          "\tprovisionally assign r to h",
          "\tif h is fully subscribed (after assigning r to h) then",
          "\t\ts := worst resident provisionally assigned to h",
          "\t\tfor each successor s' of s on h's list",
          "\t\t\tremove s' and h from each other's lists",
          "the stable matching consists of all n engagements"
        ]
      }
    ],

    [
      "spap-orig-egs", {
        id: "spap-orig-egs",
        name: "Student-Project Allocation with Project Priority",
        orientation: ["Student", "Project", "Lecturer"],
        equalGroups: true,
        algorithm: "SpaP",
        service: this.SpapOrigEgsService,
        description: "The algorithm assigns projects, offered by lecturers to students. To achieve this an extension of the Gale/Shapley algorithm for Hospital-Residents Problem is utilised",
        helpTextMap: {
          1: "Clear the matches of all students, projects and lecturers",
          2: "While there are some students who are not assigned and have a non-empty list, select the next one (%currentAgent%)",
          3: "%preferredProject% is selected as %currentAgent%'s most preferred project",
          4: "%lecturer% is selected as %preferredProject%'s lecturer",
          5: "%worstProject% is selected as %lecturer%'s worst project",
          6: "Check if %lecturer% is non-empty",
          7: "%lecturer% is non-empty, so %worstProject% is selected as %lecturer%'s worst non-empty project",
          8: "%currentAgent% applies to %preferredProject%",
          9: "Check if %preferredProject% is fully subscribed or (%lecturer% is fully subscribed and %preferredProject% is %worstProject%)",
          10: "%preferredProject% is fully subscribed or (%lecturer% is fully subscribed and %preferredProject% is %worstProject%), so delete %preferredProject% from %currentAgent%'s list",
          11: "%preferredProject% is not fully subscribed and (%lecturer% is not fully subscribed or %preferredProject% is not %worstProject%), so provisionally assign %currentAgent% to %preferredProject% and %lecturer%",
          12: "Check if %lecturer% is over-subscribed",
          13: "%lecturer% is over-subscribed, so %randomStudent% is selected as a random student with %worstProject% in their list",
          14: "Assign %randomStudent% to be free",
          15: "Delete %worstProject% from %randomStudent%'s list",
          16: "Check if %lecturer% is fully subscribed",
          17: "%lecturer% is fully subscribed, so for each %successor% of %worstProject% on %lecturer%'s list, loop through each %randomStudent% with %successor% in list",
          18: "For each %randomStudent% with %successor% in list, remove %successor% from %randomStudent%'s list",
          19: "A stable matching has been found."
        },
        code: [
          "set each student, project and lecturer to be completely free;",
          "while (some student si is free) and (si has a nonempty list) {",
          "\tpj := first project on si's list",
          "\tlk := lecturer who offers pj",
          "\tpz := lk's worst project",
          "\tif lk is non-empty then",
          "\t\tpz := lk's worst non-empty project;",
          "\tsi applies to pj",
          "\tif (pj is fully subscribed) or ((lk is fully subscribed) and (pj === pz)) then",
          "\t\tdelete pj from si's list",
          "\telse",
          // M = M U {(si, pj)},
          "\t\tprovisionally assign si to pj and lk",
          "\t\tif (lk is over subscribed) then",
          "\t\t\tsr := some student with pz in list",
          // M = M\{(sr, pz)},
          "\t\t\tassign sr to be free (clear match)",
          "\t\t\tremove pz from sr's list",
          "\t\tif (lk is fully subscribed) then",
          "\t\t\tfor each successor pt of pz on lk's list",
          "\t\t\t\tfor each student sr with pt in list",
          "\t\t\t\t\tremove pt from sr's list",
          "}" // a stable matching has been found
        ]
      }
    ],

    [
      "spap-improved-egs", {
        id: "spap-improved-egs",
        name: "Improved Student-Project Allocation with Project Priority",
        orientation: ["Student", "Project", "Lecturer"],
        equalGroups: true,
        algorithm: "ImprovedSpaP",
        service: this.SpapImprovedEgsService,
        description: "An improvement on Manlove's SpaP algorithm which increases the guaranteed stable matching from half to 3/2",
        helpTextMap: {
          1: "Clear the matches of all students, projects and lecturers",
          2: "Unpromote all students",
          3: "While there are some students who are not assigned and (have a non-empty list or are unpromoted), select the next one (%currentAgent%)",
          4: "Check if %currentAgent%'s list is empty and %currentAgent% is unpromoted",
          5: "%currentAgent%'s list is empty and %currentAgent% is unpromoted, so promote %currentAgent%",
          6: "%firstProject% is selected as the first project on %currentAgent%'s list",
          7: "%lecturer% is selected as lecturer who offers %firstProject%",
          8: "%currentAgent% applies to %firstProject%",
          9: "Check if %firstProject% is full or (%lecturer% is full and %firstProject% is %lecturer%'s worst non-empty project)",
          10: "Check if %firstProject% is full or (%lecturer% is full and %firstProject% is %lecturer%'s worst non-empty project), so check if (%currentAgent% is unpromoted or there is no unpromoted students assigned to %firstProject%",
          11: "%currentAgent% is unpromoted or there is no unpromoted student assigned to %firstProject%, so reject %currentAgent%",
          12: "%currentAgent% is promoted and there is no unpromoted student assigned to %firstProject%, so reject random unpromoted student that has been assigned to %firstProject% and match %currentAgent% with %firstProject%",
          13: "%firstProject% is not full and (%lecturer% is not full or %firstProject% is not %lecturer%'s worst non-empty project), so check if %lecturer% is full and prefers %lecturer%'s worst non-empty project to %firstProject%",
          14: "%lecturer% is full and prefers %lecturer%'s worst non-empty project to %firstProject%, so reject %currentAgent%",
          15: "%lecturer% is not full or does not prefer %lecturer%'s worst non-empty project to %firstProject%, so check if neither condition fits",
          16: "Neither condition fits, so match %currentAgent% with %firstProject%",
          17: "Check if %lecturer% is oversubscribed",
          18: "%lecturer% is over-subscribed, so select %worstProject% from %lecturer%'s list",
          19: "Check if %worstProject%'s assignment contains an unpromoted student",
          20: "%worstProject%'s assignment contains an unpromoted student, so reject random unpromoted student assigned to %worstProject%",
          21: "%worstProject%'s assignment does not contain an unpromoted student, so reject a random student assigned to %worstProject%",
          22: "A stable matching has been found"
        },
        code: [
          "set each student, project and lecturer to be completely free;",
          "while (some student si is free) and (si has a nonempty list) and (si is unpromoted) {",
          "\tsi is unpromoted and has an empty list",
          "\t\tpromote si",
          "\tpj := first project on si's list",
          "\tlk := lecturer offering pj",
          "\tsi applies to pj",
          "\tif (pj is full) or (lk is full and pj === lk's worst project)",
          "\t\tif (si is unpromoted) or (no unpromoted student assigned to pj)",
          "\t\t\treject si",
          "\t\telse {reject random unpromoted student assigned to pj and assign si to pj}",
          "\telse if (lk is full and lk's worst non-empty project has index < pj's index)",
          "\t\treject si",
          "\telse",
          "\t\tassign si to pj",
          "\t\tif (lk is over-subscribed)",
          "\t\t\tpz := lk's worst non-empty project",
          "\t\t\tif pz's assignment list containst unpromoted student",
          "\t\t\t\treject random unpromoted student assigned to pz",
          "\t\t\telse",
          "\t\t\t\treject random student assigned to pz",
          "}" // a stable matching has been found
        ]
      }
    ],
  ]);

  

  pluralMap: Map<string, string> = new Map([
    ["Man", "Men"],
    ["Woman", "Women"],
    ["Resident", "Residents"],
    ["Hospital", "Hospitals"],
    ["Student", "Students"],
    ["Project", "Projects"],
    ["Lecturer", "Lecturers"],
  ]);

  constructor(
    public gsStableMarriageService: GsStableMarriageService,
    public egsStableMarriageService: EgsStableMarriageService,
    public HrResidentEgsService: HrResidentEgsService,
    public SpapOrigEgsService: SpapOrigEgsService,
    public SpapImprovedEgsService: SpapImprovedEgsService,
  ) { }

  getListOfAlgorithms(): Array<Algorithm> {
    return Array.from(this.mapOfAvailableAlgorithms.values());
  }

}
