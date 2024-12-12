// node src/12.js < data/day12-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

const dusa = new Dusa(`
#builtin INT_PLUS plus

cell X Y is Ch :-
    root 0 is Root,
    field Root Y is Line,
    field Line X is Ch.

# Surround the grid with "." cells
cell -1 Y is "." :-
    root 0 is Root,
    field Root Y is _.
cell Width Y is "." :-
    root 0 is Root,
    field Root Y is Line,
    length Line is Width.
cell X -1 is "." :-
    root 0 is Root,
    field Root Y is Line,
    field Line X is _.
cell X Height is "." :-
    root 0 is Root,
    length Root is Height,
    field Root Y is Line,
    field Line X is _.
    

dir 0 -1. dir 0 1. dir -1 0. dir 1 0.

rep X Y is? (tuple Ch X Y) :- cell X Y is Ch.
rep X' Y' is Rep :-
   cell X Y is Ch, rep X Y is Rep, 
   dir DX DY,
   X' == plus X DX,
   Y' == plus Y DY,
   cell X' Y' is Ch.

# Outputs
fenceFor Rep X Y DX DY :-
   rep X Y is Rep,
   dir DX DY,
   rep (plus X DX) (plus Y DY) is Rep',
   Rep != Rep'.
isRep Rep :- rep _ _ is Rep, Rep != tuple "." _ _.
hasRep Rep X Y :- rep X Y is Rep.
`);

dusa.assert(...facts);

const dusa2 = new Dusa(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus
sideRep Rep X Y DX DY is? (tuple Rep X Y DX DY) :-
   fenceFor Rep X Y DX DY.
sideRep Rep X' Y' DX DY is SideRep :-
   sideRep Rep X Y DX DY is SideRep,
   X' == plus X DY,
   Y' == plus Y DX,
   fenceFor Rep X' Y' DX DY.
sideRep Rep X' Y' DX DY is SideRep :-
   sideRep Rep X Y DX DY is SideRep,
   X' == minus X DY,
   Y' == minus Y DX,
   fenceFor Rep X' Y' DX DY.
hasSideRep Rep SideRep :- sideRep Rep _ _ _ _ is SideRep.
`);
dusa2.assert(
  ...[...dusa.solution.lookup("fenceFor")].map((args) => ({
    name: "fenceFor",
    args,
  }))
);

let accum = 0;
let accum2 = 0;

for (const [rep] of dusa.solution.lookup("isRep")) {
  const [ch, x, y] = rep.args;
  const area = [...dusa.solution.lookup("hasRep", rep)].length;
  const border = [...dusa.solution.lookup("fenceFor", rep)].length;
  const discountBorder = [...dusa2.solution.lookup("hasSideRep", rep)].length;
  console.log(
    `A region of ${ch} plants with price ${area} * ${border} = ${area * border}`
  );
  console.log(
    `A region of ${ch} plants with discount price ${area} * ${discountBorder} = ${
      area * discountBorder
    }`
  );
  accum += area * border;
  accum2 += area * discountBorder;
}
console.log(`So, it has a total price of ${accum}.`);
console.log(`And, it has a total bulk volume discount price of ${accum2}.`);
