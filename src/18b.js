// node src/18b.js 6  < data/day18-test.txt
// node src/18b.js 70  < data/day18-rob.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { argv } from "process";
import { compile, Dusa } from "dusa";

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
const gridmax = parseInt(argv[2]);
const tmax = json.length;
facts.push({ name: "gridmax", args: [], value: gridmax });

const REACHABILITY = compile(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus

dim X :- gridmax is X.
dim (minus X 1) :- dim X, X > 0.

blocked X Y is? ff :- dim X, dim Y.
blocked (field F "x") (field F "y") is tt :-
    root 0 is Root,
    field Root N is F,
    tmax is TMax,
    N <= TMax.

delta 0 1. delta 1 0. delta 0 -1. delta -1 0.
reachable 0 0.
reachable X' Y' :- 
    delta DX DY,
    reachable X Y,
    X' == plus X DX, Y' == plus Y DY,
    blocked X' Y' is ff.
`);

// invariants:
// lo <= hi
// with corruptions [0..lo), goal is REACHABLE
// with corruptions [0..hi], goal is NOT REACHABLE
let lo = 0;
let hi = tmax;

while (hi > lo) {
  const mid = Math.floor(lo + (hi - lo) / 2);
  console.log({ lo, mid, hi });

  // Test whether corruptions [0..mid] are reachable
  const dusa = new Dusa(REACHABILITY);
  dusa.assert(...facts, { name: "tmax", value: mid });
  if (dusa.solution.has("reachable", gridmax, gridmax)) {
    console.log(`After ${mid} steps, still reachable`);
    lo = mid + 1;
  } else {
    console.log(`After ${mid} steps, *not* reachable`);
    hi = mid;
  }
}
console.log({ lo, hi });
console.log(json[hi]);
