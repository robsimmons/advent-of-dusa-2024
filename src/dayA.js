// node src/dayA.js < data/dayA-test.txt > data/dayA-test.json 2> data/dayA-test.dusa
// node src/dayA.js < data/dayA-rob.txt > data/dayA-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split("").map(x => parseInt(x)));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
