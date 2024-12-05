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

const dusa = new Dusa(`#builtin INT_PLUS plus

order_rule A B :-
   field _ "rules" is Rules,
   field Rules _ is Rule,
   field Rule 0 is A,
   field Rule 1 is B.

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
   order_rule P2 P1.`);
dusa.assert(...jsonToFacts(json));
function dusaSort(x, y) {
  if (x === y) return 0;
  if (dusa.solution.has("order_rule", x, y)) return -1;
  if (dusa.solution.has("order_rule", y, x)) return 1;
  console.log(`No rule for comparing ${x} and ${y}`);
  return 0;
}

console.log(
  [
    ...dusa.solution.lookup("wrong_order").map(([upd]) => {
      const sorted = [
        ...dusa.solution.lookup("update", upd).map(([_, page]) => page),
      ].toSorted(dusaSort);
      return sorted[Math.floor(sorted.length / 2)];
    }),
  ].reduce((x, y) => x + y, 0)
);
