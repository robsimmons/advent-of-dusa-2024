// node src/day19.js < data/day19-test.txt > data/day19-test.json 2> data/day19-test.dusa
// node src/day19.js < data/day19-rob.txt > data/day19-rob.json 2> /dev/null

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = (([towels, designs]) => ({
  towels: towels.split(", "),
  designs: designs.split("\n"),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
