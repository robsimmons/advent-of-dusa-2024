// node src/02b.js < data/day02-test.txt

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";
import { Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(" ").map((n) => parseInt(n)));
const facts = jsonToFacts(json);

const dusa = new Dusa(`
# Math
#builtin INT_PLUS plus
#builtin INT_MINUS minus
#builtin INT_TIMES times
#builtin NAT_SUCC s

# Parsing
reports Line is Length :-
   root 0 is Root,
   field Root Line is LineRoot,
   length LineRoot is Length.

rawReport Line Index is Value :-
   root 0 is Root,
   field Root Line is LineRoot,
   field LineRoot Index is Value.

# Compute every possible dropping (including dropping nothing)
drop Line Index :- reports Line is Index.
drop Line (minus Index 1) :- drop Line Index, Index > 0.
report Line Drop Index is Value :-
   drop Line Drop,
   rawReport Line Index is Value,
   Index < Drop.
report Line Drop (minus Index 1) is Value :-
   drop Line Drop,
   rawReport Line Index is Value,
   Index > Drop.

# Computing one-step differences
diff Line Drop (minus First Second) :-
   report Line Drop A is First,
   report Line Drop (s A) is Second.

# # UNSAFE DIFFERENCES # #

# Levels must be all increasing or all decreasing
safe Line Drop is ff :- diff Line Drop D1, diff Line Drop D2, D1 > 0, D2 < 0.

# Differences must be at least one
safe Line Drop is ff :- diff Line Drop 0.

# Differences must be at most three
safe Line Drop is ff :- diff Line Drop D, D > 3.
safe Line Drop is ff :- diff Line Drop D, D < -3.

# Otherwise, it's safe
safe Line Drop is? tt :- report Line Drop _ is _.
hasSafe Line :- safe Line _ is tt.
`);
dusa.assert(...facts);
console.log([...dusa.solution.lookup('hasSafe')].length);
