// node src/13b.js < data/day13-test.txt

import { readFileSync } from "fs";
function lineToFact(line) {
  const [_, label, x, y] = line.match(
    /^([A-Za-z ]*): X[+=]([0-9]*), Y[+=]([0-9]*)$/
  );
  return [label, { x: BigInt(parseInt(x)), y: BigInt(parseInt(y)) }];
}

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n\n")
  .map((group) => Object.fromEntries(group.split("\n").map(lineToFact)));

let accum = 0n;
for (const group of json) {
  const goal = group["Prize"];
  const da = group["Button A"];
  const db = group["Button B"];
  goal.x += 10000000000000n;
  goal.y += 10000000000000n;

  // goal.x = a * da.x + b * db.x
  // goal.y = a * da.y + b * db.y

  // a = goal.x/da.x - b * db.x/da.x
  // a = goal.y/da.y - b * db.y/da.y

  // b * db.x/da.x - goal.x/da.x = b * db.y/da.y - goal.y/da.y
  // b * db.x/da.x - b * db.y/da.y = goal.y/da.y + goal.x/da.x
  // b * (db.x/da.x - db.y/da.y) = goal.x/da.x - goal.y/da.y
  // b * (db.x*da.y - db.y*da.x) = goal.x*da.y - goal.y*da.x

  const NUMER = goal.x * da.y - goal.y * da.x;
  const DENOM = db.x * da.y - db.y * da.x;
  if (DENOM === 0n) {
    // This is DEFINITELY possible with appropriate inputs
    // however, that dog didn't bark for the problem inputs
    throw new Error("NO UNIQUE SOLUTION");
  } else if (NUMER % DENOM !== 0n) {
    console.log("No solution (1)");
  } else {
    const b = NUMER / DENOM;
    const a_dax = b * db.x - goal.x;
    if (a_dax % da.x !== 0n) {
      // I'm not certain if this case is possible: an integer solution
      // for b but not for a? Seems like it should be possible, but didn't
      // occur.
      console.log("No solution(2)");
    } else {
      accum += 3n * (-a_dax / da.x) + b;
    }
  }
}
console.log(`Total: ${accum}`);
