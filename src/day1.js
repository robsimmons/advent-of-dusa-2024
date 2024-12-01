// node src/day1.js < data/day1-test.txt > data/day1-test.json 2> data/day1-test.dusa
// node src/day1.js < data/day1-rob.txt > data/day1-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split("   ").map((n) => parseInt(n)));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
