// node src/5b.js < data/day5-test.txt

import { Dusa } from "dusa";
import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";

const json = (([part1, part2]) => {
  return {
    rules: part1
      .split("\n")
      .map((line) => line.split("|").map((n) => parseInt(n))),
    updates: part2
      .split("\n")
      .map((line) => line.split(",").map((n) => parseInt(n))),
  };
})(readFileSync(0, "utf-8").trim().split("\n\n"));

const dusa = new Dusa(`
#builtin INT_PLUS plus

compare A B is -1 :-
   field _ "rules" is Rules,
   field Rules _ is Rule,
   field Rule 0 is A,
   field Rule 1 is B.
compare B A is 1 :- compare A B is -1.
compare A A is? 0 :- update _ _ is A.

update U I is P :-
   field _ "updates" is Updates,
   field Updates U is Update,
   field Update I is P.
update_length U is Len :-
   field _ "updates" is Updates,
   field Updates U is Update,
   length Update is Len.

wrong_order U :- 
   update U I1 is P1,
   update U I2 is P2,
   I1 < I2,
   compare P1 P2 is 1.`);
dusa.assert(...jsonToFacts(json));

console.log(
  [
    ...dusa.solution.lookup("wrong_order").map(([upd]) => {
      const sorted = [
        ...dusa.solution.lookup("update", upd).map(([_, page]) => page),
      ].toSorted((x, y) => dusa.solution.get("compare", x, y));
      return sorted[Math.floor(sorted.length / 2)];
    }),
  ].reduce((x, y) => x + y, 0)
);
