// node src/day6.js < data/day6-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { compile, Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

const blockages = new Dusa(`
#builtin NAT_SUCC s
#builtin INT_PLUS plus

# Parsing
empty X Y :-
   root 0 is Root,
   field Root Y is Line,
   field Line X is ".".

# Map with one extra blockage
blockage is? (tuple X Y) :- empty X Y.
`);
blockages.assert(...facts);

const trace = compile(`
#builtin NAT_SUCC s
#builtin INT_PLUS plus

# Parsing with blockage
#demand blockage is _.
cell X Y is blocked :-
   root 0 is Root,
   field Root Y is Line,
   field Line X is "#".
cell X Y is blocked :-
   blockage is (tuple X Y).
cell X Y is clear :-
   root 0 is Root,
   field Root Y is Line,
   field Line X is Ch, Ch != "#",
   blockage != tuple X Y.
step 0 X Y 0 -1 :-
   root 0 is Root,
   field Root Y is Line,
   field Line X is "^".

# Core logic
right_turn 0 1 -1 0.
right_turn -1 0 0 -1.
right_turn 0 -1 1 0.
right_turn 1 0 0 1.

step 0 X Y 0 -1 :- start X Y.
step (s N) (plus X DX) (plus Y DY) DX DY :-
   step N X Y DX DY, next N is tt,
   cell (plus X DX) (plus Y DY) is clear.
step (s N) X Y DX' DY' :-
   step N X Y DX DY, next N is tt,
   cell (plus X DX) (plus Y DY) is blocked,
   right_turn DX DY DX' DY'.

next N is? tt :- step N _ _ _ _.
next N is ff :- step N X Y DX DY, step N' X Y DX DY, N > N'.
#demand next N is ff.
`);

let accum = 0;
for (const blockSol of blockages) {
  const [x, y] = blockSol.get("blockage")?.args;
  const dusa = new Dusa(trace);
  dusa.assert(...facts);
  dusa.assert({ name: "blockage", value: { name: "tuple", args: [x, y] } });
  if (dusa.solution) {
    console.log(`A blockage at ${x},${y} causes a loop`);
    accum += 1;
  } else {
    console.log(`A blockage at ${x},${y} does not cause a loop`);
  }
}
console.log(`There are ${accum} locations where you can cause the a loop.`);
