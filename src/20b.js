// node src/20b.js 50 < data/day20-test.txt
// node src/20b.js 100 < data/day20-rob.txt

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";
import { Dusa } from "dusa";
import { argv } from "process";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

const dusa = new Dusa(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus
#builtin NAT_SUCC s

d -1 0. d 1 0. d 0 -1. d 0 1.
at X Y is Ch :- 
   root 0 is Rows,
   field Rows Y is Row,
   field Row X is Ch.

step 0 is (tuple X Y) :- 
   at X Y is "S".

step (s N) is? (tuple X' Y') :-
   step N is (tuple X Y), 
   at X Y != "E",
   d DX DY,
   X' == plus X DX,
   Y' == plus Y DY,
   at X' Y' is Ch, Ch != "#".

count X Y is N :- step N is (tuple X Y).

#lazy abs
abs N is N :- N >= 0.
abs N is (minus 0 N) :- N <= 0.

delta 20.
delta (minus N 1) :- delta N, N > -20.
cheatd DX DY :-
   delta DX, delta DY, 
   plus (abs DX) (abs DY) > 1,
   plus (abs DX) (abs DY) <= 20.`);
dusa.assert(...facts);

console.log([...dusa.solution.lookup("cheatd")]);

const min = parseInt(argv[2]);
const cheats = Array.from({ length: 10000 }).map(() => 0);

for (const [x, y, n] of dusa.solution.lookup("count")) {
  for (const [dx, dy] of dusa.solution.lookup("cheatd")) {
    const n2 = dusa.solution.get("count", x + dx, y + dy);
    const d = Math.abs(dx) + Math.abs(dy);
    if (n2 !== undefined && n2 > n) {
      const saved = n2 - n - d;
      if (saved >= min) {
        console.log(`${x},${y} -> ${x + dx},${y + dy} saves ${saved}`);
        cheats[saved] += 1;
      }
    }
  }
}

for (const [saved, num] of cheats.entries()) {
  if (num > 0) {
    console.log(`There are ${num} cheats that save ${saved} picoseconds`);
  }
}
console.log(`Total: ${cheats.reduce((x, y) => x + y, 0)}`);
