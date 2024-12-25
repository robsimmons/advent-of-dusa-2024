// node src/day25.js < data/day25-test.txt > data/day25-test.json 2> data/day25-test.dusa
// node src/day25.js < data/day25-rob.txt > data/day25-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n\n")
  .map((schema) => schema.split("\n").map((line) => line.split("")));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
