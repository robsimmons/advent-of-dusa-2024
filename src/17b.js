// node src/17b.js < data/day17-rob.txt

import { readFileSync } from "fs";

const [_ra, _rb, _rc, prog_] = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .filter((x) => x.trim() !== "")
  .map((line) => line.split(": ")[1].trim());

const prog = prog_.split(",").map((x) => BigInt(x));

function emit(accum, to_output) {
  if (to_output.length === 0) return accum;
  console.log(`Attempting to attach ${to_output} given ${accum}`);
  let result = null;
  for (let next = 0n; next < 8n; next++) {
    const candidate_accum = (accum << 3n) | next;
    const n1 = next ^ 5n;
    const n2 = next ^ 3n;
    const result_output = n2 ^ ((candidate_accum >> n1) & 7n);
    console.log(`appending ${next} outputs ${result_output}`);
    if (to_output[0] === result_output) {
      result = emit(candidate_accum, to_output.slice(1));
      if (result !== null) return result;
    }
  }
  return result;
}

console.log(emit(0n, prog.toReversed()));
