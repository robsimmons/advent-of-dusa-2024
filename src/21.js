// Part 1:
// node src/21.js 2 < data/day21-test.txt

// Part 2:
// node src/21.js 25 < data/day21-test.txt

import { Dusa } from "dusa";
import { readFileSync } from "fs";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => ({ asNum: parseInt(line), asSeq: line.split("") }));

const dusa = new Dusa(`# AOC 2024, Day 21, Part 2

#builtin NAT_SUCC s
#builtin INT_PLUS plus
#builtin INT_TIMES times

# Robot-ception on the cell phone
phone 0 0 is "7". phone 1 0 is "8". phone 2 0 is "9".
phone 0 1 is "4". phone 1 1 is "5". phone 2 1 is "6".
phone 0 2 is "1". phone 1 2 is "2". phone 2 2 is "3".
                  phone 1 3 is "0". phone 2 3 is "A".

               pad 1 0 is uu. pad 2 0 is aa.
pad 0 1 is ll. pad 1 1 is dd. pad 2 1 is rr.

d uu is (tuple 0 -1).
d ll is (tuple -1 0).
d dd is (tuple 0 1).
d rr is (tuple 1 0).

#lazy revisits_origin
revisits_origin _ 0 0 is tt.
revisits_origin nil X Y is ff :-
    tuple X Y != tuple 0 0.
revisits_origin (cons Seq D) X Y is (revisits_origin Seq X' Y') :-
    tuple X Y != tuple 0 0,
    d D is (tuple DX DY),
    X' == plus X DX,
    Y' == plus Y DY.

reach1 N1 N1 nil :- phone _ _ is N1.
reach1 N1 N3 (cons Seq D) :-
    reach1 N1 N2 Seq,
    phone X Y is N2,
    d D is (tuple DX DY),
    phone (plus X DX) (plus Y DY) is N3,
    revisits_origin Seq DX DY is ff.
    
reach2 N1 N1 nil :- pad _ _ is N1.
reach2 N1 N3 (cons Seq D) :- 
    reach2 N1 N2 Seq,
    pad X Y is N2,
    d D is (tuple DX DY),
    pad (plus X DX) (plus Y DY) is N3,
    revisits_origin Seq DX DY is ff.`);

function seqToArray(seq) {
  const result = ["aa"];
  while (seq.name != "nil") {
    result.push(seq.args[1].name);
    seq = seq.args[0];
  }

  return result.toReversed();
}

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A"];
const digitPoss = {};
for (const start of digits) {
  digitPoss[start] = {};
  for (const end of digits) {
    digitPoss[start][end] = [...dusa.solution.lookup("reach1", start, end)].map(
      ([seq]) => seqToArray(seq)
    );
  }
}

const dirs = ["uu", "ll", "rr", "dd", "aa"];
const dirPoss = {};
for (const start of dirs) {
  dirPoss[start] = {};
  for (const end of dirs) {
    dirPoss[start][end] = [
      ...dusa.solution.lookup("reach2", { name: start }, { name: end }),
    ].map(([seq]) => seqToArray(seq));
  }
}

const memo = new Map();
function minimizeDist(d1, d2, numAs) {
  // Base case: just the shortest path
  if (numAs === 0)
    return dirPoss[d1][d2].reduce(
      (min, arr) => Math.min(min, arr.length),
      Infinity
    );

  const key = `${d1}-${d2}-${numAs}`;
  if (memo.has(key)) return memo.get(key);

  let { bestCost, bestRoute } = getMinRouteCost(dirPoss[d1][d2], numAs - 1);
  memo.set(key, bestCost);
  console.log({ key, bestCost, bestRoute });
  return bestCost;
}

function getMinRouteCost(routes, numAs) {
  let bestCost = Infinity;
  let bestRoute = null;
  for (const route of routes) {
    let last = "aa";
    let cost = 0;
    for (const next of route) {
      cost += minimizeDist(last, next, numAs);
      last = next;
    }
    if (bestCost > cost) {
      bestCost = cost;
      bestRoute = route;
    }
  }
  return { bestCost, bestRoute };
}

for (const { asNum, asSeq } of json) {
  let last = "A";
  let cost = 0;
  let route = [];
  for (const next of asSeq) {
    const { bestCost, bestRoute } = getMinRouteCost(digitPoss[last][next], 0);
    cost += bestCost;
    route = [...route, ...bestRoute];
    last = next;
    console.log({ cost, route, last, next });
  }
  console.log({ asNum, asSeq, cost, route });
}
