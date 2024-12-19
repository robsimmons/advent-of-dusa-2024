// node src/18a.js 6 12 < data/day18-test.txt
// node src/18a.js 70 1024 < data/day18-rob.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { argv } from "process";
import { Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const [x, y] = line
      .trim()
      .split(",")
      .map((x) => parseInt(x));
    return { x, y };
  });
const facts = jsonToFacts(json);
facts.push({ name: "gridmax", args: [], value: parseInt(argv[2]) });
facts.push({ name: "tmax", args: [], value: parseInt(argv[3]) });

// Dijkstra single-source shortest path/undirected A*
const dusa = new Dusa(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus

dim X :- gridmax is X.
dim (minus X 1) :- dim X, X > 0.

blocked X Y is? ff :- dim X, dim Y.
blocked (field F "x") (field F "y") is tt :-
    root 0 is Root,
    field Root N is F,
    tmax is TMax,
    N < TMax.

costto 0 0 is 0.

delta 0 1. delta 1 0. delta 0 -1. delta -1 0.

frontier_cost X Y is none :- costto X Y is _.
frontier_cost (plus X DX) (plus Y DY) is? (plus C 1) :-
    delta DX DY,
    costto X Y is C,
    blocked (plus X DX) (plus Y DY) is ff.

answer is C :-
    gridmax is M,
    frontier_cost M M is C.
`);
dusa.assert(...facts);

while (!dusa.solution.has("answer")) {
  const [x, y, c] = [...dusa.solution.lookup("frontier_cost")]
    .filter(([_x, _y, c]) => c?.name !== "none")
    .reduce((a, b) => (!a ? b : a[2] < b[2] ? a : b));
  dusa.assert({ name: "costto", args: [x, y], value: c });
  console.log({ x, y, c });
}

console.log(dusa.solution.get("answer"));
