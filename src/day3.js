// node src/day3.js < data/day3-test.txt > data/day3-test.json 2> data/day3-test.dusa
// node src/day3.js < data/day3-rob.txt > data/day3-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("mul(");
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
