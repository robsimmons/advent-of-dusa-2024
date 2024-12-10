// node src/day13.js < data/day13-test.txt > data/day13-test.json 2> data/day13-test.dusa
// node src/day13.js < data/day13-rob.txt > data/day13-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
