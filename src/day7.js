// node src/day7.js < data/day7-test.txt > data/day7-test.json 2> data/day7-test.dusa
// node src/day7.js < data/day7-rob.txt > data/day7-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const [k, v] = line.trim().split(": ");
    return { test: parseInt(k), eqn: v.split(" ").map((x) => parseInt(x)) };
  });
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
