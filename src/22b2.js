// node src/22b2.js < data/day22-test2.txt

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
const counts = new Map();
for (const [a, b, c, d] of dusa.solution.lookup("seq")) {
  counts.set(`${a}.${b}.${c}.${d}`, 0);
}

/** 
 * Add to the counts map the effects of _every_ sequence
 * on this starting index.
 */
function index(seed) {
  const seen = new Set();
  let last;
  let current = seed % 10;
  let secret = seed;
  let a = null;
  let b = null;
  let c = null;
  let d = null;
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

    if (a === null) continue;
    const key = `${a}.${b}.${c}.${d}`;
    if (seen.has(key)) continue;
    seen.add(key);
    counts.set(key, counts.get(key) + current);
  }
}

// Add all the seeds to the index
for (const seed of nums) {
  index(seed);
}

// Go through the sequence to find the best one
let bestSeq = "";
let bestSum = -Infinity;
for (const [key, value] of counts.entries()) {
  if (value > bestSum) {
    bestSeq = key;
    bestSum = value;
    console.log({ bestSeq, bestSum });
  }
}
