// node src/22a.js < data/day22-test.txt

import { readFileSync } from "fs";

const nums = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => BigInt(line));

const MASK = (1n << 24n) - 1n;
function advance(nums) {
  for (let [i, n] of nums.entries()) {
    n = MASK & (n ^ (n << 6n));
    n = MASK & (n ^ (n >> 5n));
    n = MASK & (n ^ (n << 11n));
    nums[i] = n;
  }
}

for (let i = 0; i < 2000; i++) {
  advance(nums);
}

console.log(nums.reduce((x, y) => x + y, 0n));
