// node src/day11.js < data/day11-test.txt > data/day11-test.json 2> data/day11-test.dusa
// node src/day11.js < data/day11-rob.txt > data/day11-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split(" ")
  .map((x) => parseInt(x));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
