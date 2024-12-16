// node src/14b.js 11x7 100 < data/day14-test.txt
// node src/14b.js 101x103 1000 < data/day14-rob.txt

import { readFileSync } from "fs";
import { argv } from "process";
import { compile, Dusa } from "dusa";

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
function rem(x, y) {
  const mod = x % y;
  return mod < 0 ? mod + y : mod;
}

const connected = compile(`
#builtin INT_PLUS plus
d 0 1. d 0 -1. d 1 0. d -1 0.

rep X Y is? (tuple X Y) :- loc X Y _.
rep X' Y' is Rep :-
    d DX DY, rep X Y is Rep,
    X' == plus X DX, Y' == plus Y DY,
    loc X' Y' _.
isRep (tuple X Y) :- rep X Y is (tuple X Y).
hasRep Rep X Y :- rep X Y is Rep.
`);

for (let i = 27n; i < steps; i += 103n) {
  const dusa = new Dusa(connected);
  for (const [n, { p, v }] of json.entries()) {
    const x = rem(p.x + i * v.x, width);
    const y = rem(p.y + i * v.y, height);
    dusa.assert({ name: "loc", args: [x, y, n] });
  }
  const biggestCC = [
    ...dusa.solution
      .lookup("isRep")
      .map(([rep]) => [...dusa.solution.lookup("hasRep", rep)].length),
  ].reduce((x, y) => Math.max(x, y), 0);
  const nReps = [...dusa.solution.lookup("isRep")].length;
  if (biggestCC < 220) continue;

  console.log(
    `Elapsed time ${i}, connected components ${nReps}, biggest connected component ${biggestCC}`
  );

  console.log(
    Array.from({ length: Number(height) })
      .map((_, y) =>
        Array.from({ length: Number(width) })
          .map((_, x) => {
            const count = [...dusa.solution.lookup("loc", x, y)].length;
            return count === 0 ? "." : count < 10 ? `${count}` : "#";
          })
          .join("")
      )
      .join("\n")
  );
}
