// node src/day24.js < data/day24-test.txt > data/day24-test.json 2> data/day24-test.dusa
// node src/day24.js < data/day24-rob.txt > data/day24-rob.json 2> data/day24-rob.dusa

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

function wire(str) {
  if (str.match(/^[a-z][0-9][0-9]$/))
    return { name: str[0], value: parseInt(str.slice(1)) };
  return { name: str, value: 0 };
}

const json = (([inputs, connections]) => ({
  inputs: inputs.split("\n").map((line) => {
    const [id, bool] = line.split(": ");
    return { wire: wire(id), bool };
  }),
  connections: connections.split("\n").map((line) => {
    const [id1, op, id2, _, id3] = line.split(" ");
    return { in1: wire(id1), op, in2: wire(id2), out: wire(id3) };
  }),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));
const facts = jsonToFacts(json);

console.log(JSON.stringify(facts));
console.error(facts.map((fact) => `${factToString(fact)}.`).join("\n"));
