// node src/day09.js < data/day09-test.txt > data/day09-test.json 2> data/day09-test.dusa
// node src/day09.js < data/day09-rob.txt > data/day09-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("")
  .map((digit) => parseInt(digit));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
