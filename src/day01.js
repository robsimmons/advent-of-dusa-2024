// node src/day01.js < data/day01-test.txt > data/day01-test.json 2> data/day01-test.dusa
// node src/day01.js < data/day01-rob.txt > data/day01-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split("   ").map((n) => parseInt(n)));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));