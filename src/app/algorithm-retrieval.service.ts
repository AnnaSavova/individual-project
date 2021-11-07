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

    // NEEDS MINOR EDITING

    [
      "spap-orig-egs", {
        id: "spap-orig-egs",
        name: "Student-Project Allocation (Project priority)",
        orientation: ["Student", "Project", "Lecturer"],
        algorithm: "Student-Project Allocation Algorithm with Project priority",
        service: this.SpapOrigEgsService,
        description: "The SPA-P alforightms assigns projects, offered by lectures, to students. To achieve this an extension of the Gale/Shapley algorithm for Hospital-Residents Problem is utilised",
        helpTextMap: {
          1:  "Clear the matches of all students, projects and lecturers",
          2:  "The next student who doesn't have a match and has a non-empty preference list is selected",
          3:  "The first project on %currentAgent%\'s preference list is selected (%potentialProposee%)",
          4:  "Check if capacity of %projectLecturer% offering this project is non-empty? If yes: assign %lecturer%'s %worstLproject% as worst. If not %worstLproject% becomes the next non-empty worst project",
          5:  "Check if %project% is full OR (%projectLecturer% is full AND %project% is %worstLproject%). If yes: delete %project% from %student% and move on to next project",
          6:  "Assign %project% and %projectLecturer% to %student%.",
          7:  "Check if %projectLecturer% is oversubscribed. If yes remove %worstLproject% from students lists",
          8:  "Check if %projectLecturer% is full.",
          9:  "%projectLecturer% is full so assign %projectLecturer%'s worst non-empty project as worstLproject",
          10: "Select the next successor of %worstLproject% on %projectLecturer%'s list",
          11: "Select next %student% who finds %successor% acceptable",
          12: "Delete %successor% from %student%",
          },
        code: [
          "set each student, project and lecturer to be completely free;",
          "while (some student s is free) and (s has a nonempty list)",
          "\tp := first project on s's list",
          "\tl := lecturer offering project on s's list",
          "\tpz := last project on l's list",
          "\tif l is non-empty then",
          "\t\tpz := worst non-empty project on l's list",
          "\tif p is fully subscribed or (l is fully subscribed and p == pz) then",
          "\t\t delete p from s's list",
          "\telse provisionally assign p and l to s",
          "\t\tif l is over-subscribed then",
          "\t\t\tfor random student sr with pz in list",
          "\t\t\t\tremove pz from sr's list",
          "\t\tif l is fully subscribed then",
          "\t\t\tpz := last non-empty project on l's list",
          "\t\t\tfor each successor pt of pz on l's list",
          "\t\t\t\tfor each student sr where pt in sr's list",
          "\t\t\t\t\t delete pt from sr's list",
        ]
      }
    ],

    [
      "spap-improved-egs", {
        id: "spap-improved-egs",
        name: "Improved Student-Project Allocation (Project priority)",
        orientation: ["Student", "Project", "Lecturer"],
        equalGroups: false,
        algorithm: "Student-Project Allocation Algorithm with Project priority",
        service: this.SpapImprovedEgsService,
        description: "The SPA-P alforightms assigns projects, offered by lectures, to students. To achieve this an extension of the Gale/Shapley algorithm for Hospital-Residents Problem is utilised",
        helpTextMap: {
          1: "All students are unpromoted",
          2: "The next student who is unassigned and is either unpromoted or has non-empty list is selected (%currentAgent%\)",
          3: "Check if %currentAgent%\'s preference list is empty and %currentAgent%\ is unpromoted? If yes, promote %currentAgent%\'",
          4: "The first project on %currentAgent%\'s list is selected",
        },
        code: [
          "set each student to be unpromoted;",
          "while (some student sj is unassigned) and ((sj has a non-empty list) or (sj is unpromoted))",
          "if (sj is unpromoted) and (sj has a non-empty list) then",
          "\tpromote sj",
          "pj := first project on sj's list",
          "lk := lecturer offering sj",
          "sj applies to pj",
          // UNSURE HOW TO WRITE THIS LINE REQUIRES MORE WORK
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
