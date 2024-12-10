// node src/day05.js < data/day05-test.txt > data/day05-test.json 2> data/day05-test.dusa
// node src/day05.js < data/day05-rob.txt > data/day05-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = (([part1, part2]) => {
  return {
    rules: part1
      .split("\n")
      .map((line) => line.split("|").map((n) => parseInt(n))),
    updates: part2
      .split("\n")
      .map((line) => line.split(",").map((n) => parseInt(n))),
  };
})(readFileSync(0, "utf-8").trim().split("\n\n"));

const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
