// node src/14a.js 11x7 100 < data/day14-test.txt
// node src/14a.js 101x103 100 < data/day14-rob.txt

import { readFileSync } from "fs";
import { argv } from "process";
import { Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const m = line.match(/^p=(-?[0-9]+),(-?[0-9]+) v=(-?[0-9]+),(-?[0-9]+)$/);
    return {
      p: { x: BigInt(m[1]), y: BigInt(m[2]) },
      v: { x: BigInt(m[3]), y: BigInt(m[4]) },
    };
  });

const [width, height] = argv[2].split("x").map((n) => BigInt(n));
const steps = BigInt(argv[3]);

const dusa = new Dusa(`
#demand mid_x is _.
#demand mid_y is _.

#lazy bin
bin Mid N is 0 :- N < Mid.
bin Mid N is 1 :- N > Mid.

quadrant (bin mid_x X) (bin mid_y Y) N :-
    loc N X Y.
`);
dusa.assert(
  { name: "mid_x", value: width / 2n },
  { name: "mid_y", value: height / 2n }
);

function rem(x, y) {
  const mod = x % y;
  return mod < 0 ? mod + y : mod;
}

for (const [n, { p, v }] of json.entries()) {
  const x = rem(p.x + steps * v.x, width);
  const y = rem(p.y + steps * v.y, height);
  dusa.assert({ name: "loc", args: [n, x, y] });
}

const counts = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
].map(([qx, qy]) => [...dusa.solution.lookup("quadrant", qx, qy)].length);
console.log({ counts, sum: counts.reduce((x, y) => x * y, 1) });

// { counts: [ 122, 123, 120, 128 ], sum: 230492160 }
