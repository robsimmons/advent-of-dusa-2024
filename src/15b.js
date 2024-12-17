// node src/15b.js < data/day15-tiny.txt
// node src/15b.js < data/day15-tiny2.txt
// node src/15b.js < data/day15-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { compile, Dusa } from "dusa";

const json = (([layout, instrs]) => ({
  map: layout.split("\n").map((line) => line.trim().split("")),
  instrs: instrs.split("\n").flatMap((line) => line.trim().split("")),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));
const facts = jsonToFacts(json);

const input = new Dusa(`
#builtin INT_PLUS plus

fst "." is ".". snd "." is ".".
fst "O" is "[". snd "O" is "]".
fst "#" is "#". snd "#" is "#".
fst "@" is "@". snd "@" is ".".
at (plus X X) Y is (fst Ch) :-
    field _ "map" is Rows,
    field Rows Y is Row,
    field Row X is Ch.
at (plus X X 1) Y is (snd Ch) :-
    field _ "map" is Rows,
    field Rows Y is Row,
    field Row X is Ch.

box X Y :- at X Y is "[".
wall X Y :- at X Y is "#".
space X Y :- at X Y is Ch, Ch != "#".
robot is (tuple X Y) :- at X Y is "@".

dir "<" is (move -1 0).
dir "^" is (move 0 -1).
dir ">" is (move 1 0).
dir "v" is (move 0 1).

step N is (dir Ch) :- 
    field _ "instrs" is List,
    field List N is Ch.

width is (plus N N) :- 
    field _ "map" is Rows,
    field Rows _ is Row,
    length Row is N.
height is N :-
    field _ "map" is Rows,
    length Rows is N.
steps is N :-
    field _ "instrs" is List,
    length List is N.
`);
input.assert(...facts);

const width = input.solution.get("width");
const height = input.solution.get("height");
const walls = [...input.solution.lookup("wall")].map((args) => ({
  name: "wall",
  args,
}));
const spaces = [...input.solution.lookup("spaces")].map((args) => ({
  name: "spaces",
  args,
}));
const robot = input.solution.get("robot").args;
const boxes = [...input.solution.lookup("box")];

const step = compile(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus

push (plus X DX) (plus Y DY) :-
    robot X Y,
    move DX DY.

# A box gets pushed if either of its sides gets pushed
box_pushed N :-
    move _ _, push X Y,
    box N is (tuple X Y).
box_pushed N :-
    move _ _, push X Y,
    box N is (tuple (minus X 1) Y).

# Pushed boxes transmit their force
push (plus X 2) Y :-
    move 1 0,
    box_pushed N, box N is (tuple X Y).
push (minus X 1) Y :-
    move -1 0,
    box_pushed N, box N is (tuple X Y).
push X (plus Y DY) :-
    move 0 DY,
    box_pushed N, box N is (tuple X Y).
push (plus X 1) (plus Y DY) :-
    move 0 DY,
    box_pushed N, box N is (tuple X Y).

side 0. side 1.
#forbid box_pushed N, 
    box N is (tuple X Y),
    move DX DY, side DX',
    wall (plus X DX DX') (plus Y DY).
#forbid robot X Y, move DX DY, wall (plus X DX) (plus Y DY).

box_at X Y :- box N is (tuple X Y).
`);

for (let i = 0; i < input.solution.get("steps"); i++) {
  const dusa = new Dusa(step);
  const move = input.solution.get("step", i);
  dusa.assert(move);
  dusa.assert({ name: "robot", args: robot });
  dusa.assert(...walls);
  dusa.assert(
    ...boxes.map((args, i) => ({
      name: "box",
      args: [i],
      value: { name: "tuple", args: args },
    }))
  );

  if (!dusa.solution) continue;

  console.log(
    "Before move " +
      i +
      JSON.stringify(move)  +
      "\n" +
      Array.from({ length: height })
        .map((_, y) =>
          Array.from({ length: width })
            .map((_, x) => {
              if (x === robot[0] && y === robot[1]) return "@";
              if (dusa.solution.has("wall", x, y)) return "#";
              if (dusa.solution.has("box_at", x, y)) return "[";
              if (dusa.solution.has("box_at", x - 1, y)) return "]";
              return ".";
            })
            .join("")
        )
        .join("\n")
  );

  for (const [box] of dusa.solution.lookup("box_pushed")) {
    const [x, y] = boxes[box];
    boxes[box] = [x + move.args[0], y + move.args[1]];
  }
  robot[0] = robot[0] + move.args[0];
  robot[1] = robot[1] + move.args[1];
}

const ans = boxes.map(([x, y]) => x + 100 * y).reduce((x, y) => x + y, 0);
console.log(`GPS sum: ${ans}`);
