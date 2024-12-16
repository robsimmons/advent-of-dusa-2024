// node src/day15.js < data/day15-tiny.txt > data/day15-tiny.json 2> data/day15-tiny.dusa
// node src/day15.js < data/day15-test.txt > data/day15-test.json 2> data/day15-test.dusa
// node src/day15.js < data/day15-rob.txt > data/day15-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = (([layout, instrs]) => ({
  map: layout.split("\n").map((line) => line.trim().split("")),
  instrs: instrs.split("\n").flatMap((line) => line.trim().split("")),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
