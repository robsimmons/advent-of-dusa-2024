// node src/day9.js < data/day9-test.txt > data/day9-test.json 2> data/day9-test.dusa
// node src/day9.js < data/day9-rob.txt > data/day9-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("")
  .map((digit) => parseInt(digit));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
