// node src/19a.js < data/day19-test.txt

import { readFileSync } from "fs";

const { towels, designs } = (([towels, designs]) => ({
  towels: towels.split(", "),
  designs: designs.split("\n"),
}))(readFileSync(0, "utf-8").trim().split("\n\n"));

let table = new Map([["", 1]]);
function waysOfMatching(design) {
  if (table.has(design)) return table.get(design);
  let count = 0;
  for (const towel of towels) {
    if (design.startsWith(towel)) {
      count += waysOfMatching(design.slice(towel.length));
    }
  }
  table.set(design, count);
  return count;
}

let accum = 0;
for (const [i, design] of designs.entries()) {
  const count = waysOfMatching(design);
  console.log(`Design ${i}: ${count}`);
  accum += count;
}
console.log(accum);
