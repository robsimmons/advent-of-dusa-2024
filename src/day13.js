// node src/day13.js < data/day13-test.txt > data/day13-test.json 2> data/day13-test.dusa
// node src/day13.js < data/day13-rob.txt > data/day13-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

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

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
