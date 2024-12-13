// node src/13a.js < data/day13-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { compile, Dusa } from "dusa";

function lineToFact(line) {
  const [_, label, x, y] = line.match(
    /^([A-Za-z ]*): X[+=]([0-9]*), Y[+=]([0-9]*)$/
  );
  return [label, { x: parseInt(x), y: parseInt(y) }];
}

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n\n")
  .map((group) => Object.fromEntries(group.split("\n").map(lineToFact)));
const facts = jsonToFacts(json);

const CALC = compile(`
#builtin INT_TIMES times
#builtin INT_PLUS plus
#builtin NAT_SUCC s

goal_x is V :- input V _ _ _ _ _.
goal_y is V :- input _ V _ _ _ _.
dx_a is V :- input _ _ V _ _ _.
dy_a is V :- input _ _ _ V _ _.
dx_b is V :- input _ _ _ _ V _.
dy_b is V :- input _ _ _ _ _ V.

cost_a is 3.
cost_b is 1.

result (s A) B (plus X dx_a) (plus Y dy_a) :-
    result A B X Y, X < goal_x, Y < goal_y.
    
result A (s B) (plus X dx_b) (plus Y dy_b) :-
    result A B X Y, X < goal_x, Y < goal_y.

result 0 0 0 0.

answer (plus (times A cost_a) (times B cost_b)) :-
    result A B goal_x goal_y.
`);

let accum = 0;
for (const group of json) {
  const dusa = new Dusa(CALC);
  dusa.assert({
    name: "input",
    args: [
      group["Prize"].x,
      group["Prize"].y,
      group["Button A"].x,
      group["Button A"].y,
      group["Button B"].x,
      group["Button B"].y,
    ],
  });
  const answer = [...dusa.solution.lookup("answer")].toSorted();
  if (answer.length === 0) console.log("No solution.");
  else {
    console.log(`Cheapest solution: ${answer[0][0]} tokens`);
    accum += answer[0][0];
  }
}
console.log(`Total: ${accum}`);
