// node src/22b.js < data/day22-test2.txt

import { Dusa } from "dusa";
import { readFileSync } from "fs";

const nums = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => parseInt(line));

const dusa = new Dusa(`
#builtin INT_MINUS minus
d 9.
d (minus N 1) :- d N, N > -9.
seq A B C D :- d A, d B, d C, d D.
`);

const MASK = (1 << 24) - 1;

/**
 * Returns the number of bananas for the change sequence a0,b0,c0,d0
 * for a buyer-monkey with seed s.
 */
function checkSeq(seed, a0, b0, c0, d0) {
  let last;
  let current = seed % 10;
  let secret = seed;
  let a = Infinity;
  let b = Infinity;
  let c = Infinity;
  let d = Infinity;
  for (let i = 0; i < 2000; i++) {
    secret = MASK & (secret ^ (secret << 6));
    secret = MASK & (secret ^ (secret >> 5));
    secret = MASK & (secret ^ (secret << 11));

    last = current;
    current = secret % 10;
    a = b;
    b = c;
    c = d;
    d = current - last;
    if (a === a0 && b === b0 && c === c0 && d === d0) {
      return current;
    }
  }
  return 0;
}

/**
 * Just... evaluate all change sequences to find the best one.
 */
let bestSeq = [];
let bestSum = -Infinity;
for (const seq of dusa.solution.lookup("seq")) {
  let sum = 0;
  for (const seed of nums) {
    const bananas = checkSeq(seed, ...seq);
    sum += bananas;
  }
  if (sum > bestSum) {
    bestSum = sum;
    bestSeq = seq;
    console.log(bestSeq, bestSum);
  }
}
