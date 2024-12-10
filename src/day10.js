// node src/day10.js < data/day10-test.txt > data/day10-test.json 2> data/day10-test.dusa
// node src/day10.js < data/day10-rob.txt > data/day10-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split("").map(x => parseInt(x)));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
