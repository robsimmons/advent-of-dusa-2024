// node src/15a.js < data/day15-tiny.txt
// node src/15a.js < data/day15-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { compile, Dusa } from "dusa";

const json = (([layout, instrs]) => ({
  map: layout.split("\n").map((line) => line.trim().split("")),
  instrs: instrs.split("\n").flatMap((line) => line.trim().split("")),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));
const facts = jsonToFacts(json);

const instrs = new Dusa(`
dir "<" is (tuple -1 0).
dir "^" is (tuple 0 -1).
dir ">" is (tuple 1 0).
dir "v" is (tuple 0 1).

at X Y is Ch :-
    field _ "map" is Rows,
    field Rows Y is Row,
    field Row X is Ch.

move N is (dir Ch) :- 
    field _ "instrs" is List,
    field List N is Ch.

steps is N :-
    field _ "instrs" is List,
    length List is N.
`);
instrs.assert(...facts);

const step = compile(`
#builtin INT_PLUS plus

#lazy push
push X Y DX DY is fail :-
    at (plus X DX) (plus Y DY) is "#".
push X Y DX DY is (just (plus X DX) (plus Y DY)) :-
    at (plus X DX) (plus Y DY) is ".".
push X Y DX DY is Res :-
    at (plus X DX) (plus Y DY) is "O",
    push (plus X DX) (plus Y DY) DX DY is Res.

next X Y is? Ch :- at X Y is Ch.
next X Y is "." :-
    at X Y is "@",
    move is (tuple DX DY),
    push X Y DX DY is (just _ _).
next (plus X DX) (plus Y DY) is "@" :-
    at X Y is "@",
    move is (tuple DX DY),
    push X Y DX DY is (just _ _).
next X' Y' is "O" :-
    at X Y is "@",
    move is (tuple DX DY),
    push X Y DX DY is (just X' Y'),
    tuple X' Y' != tuple (plus X DX) (plus Y DY).
`);

let field = [...instrs.solution.lookup("at")];
for (let i = 0; i < instrs.solution.get("steps"); i++) {
  const dir = instrs.solution.get("move", i);
  const dusa = new Dusa(step);
  dusa.assert(
    { name: "move", value: dir },
    ...field.map(([x, y, value]) => ({ name: "at", args: [x, y], value }))
  );
  field = [...dusa.solution.lookup("next")];
  if (i % 10 == 0) {
    console.log("After move " + i);
    console.log(
      [
        ...Map.groupBy(
          field.toSorted((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])),
          (a) => a[1]
        ),
      ]
        .map(([_, line]) => line.map((a) => a[2]).join(""))
        .join("\n")
    );
  }
}

const ans = field
  .map(([x, y, ch]) => (ch === "O" ? x + 100 * y : 0))
  .reduce((x, y) => x + y, 0);
console.log(`GPS sum: ${ans}`);
