// node src/day17.js < data/day17-test.txt > data/day17-test.json 2> data/day17-test.dusa
// node src/day17.js < data/day17-rob.txt > data/day17-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
