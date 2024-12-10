// node src/9b.js < data/day9-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("")
  .map((digit) => parseInt(digit));
const facts = jsonToFacts(json);

const dusa = new Dusa(`#builtin INT_PLUS plus
#builtin INT_MINUS minus
#builtin INT_TIMES times
#builtin NAT_SUCC s.
#lazy p. p N is (minus N 1).

# Parsing... division would be nice
inputLen is Len :- root 0 is Root, length Root is Len.
twos 0.
twos (plus N 2) :- twos N, N < inputLen.
half 0 is 0.
half (plus N 1) is (half N) :- twos N, N < inputLen.
half (plus N 2) is (plus (half N) 1) :- twos N, N < inputLen.

# Initial placement
start (half K) Used Free :-
    root 0 is Root, twos K,
    field Root K is Used,
    field Root (plus K 1) is Free.
start (half inputLen) Used 0 :-
    root 0 is Root,
    field Root (p inputLen) is Used.
n_segs is (s (half inputLen)).
`);
dusa.assert(...facts);

let mem = [...dusa.solution.lookup("start")]
  .toSorted((a, b) => a[0] - b[0])
  .map(([id, used, free]) => ({ id, used, free }));
function memToString(mem) {
  return mem
    .map(({ id, used, free }) => {
      const label = `#${id}`.slice(0, used);
      return label.padEnd(used, "*") + "".padEnd(free, ".");
    })
    .join("");
}

function memToChecksum(mem) {
  let i = 0;
  let accum = 0;
  for (const cell of mem) {
    for (let k = 0; k < cell.used; k++) {
      accum += cell.id * i;
      i += 1;
    }
    i += cell.free;
  }
  return accum;
}

//console.log(memToString(mem));
for (let round = mem.length - 1; round >= 0; round--) {
  const indexSrc = mem.findIndex((cell) => cell.id === round);
  const src = mem[indexSrc];
  const indexDst = mem
    .slice(0, indexSrc)
    .findIndex((cell) => cell.free >= src.used);
  if (indexDst >= 0) {
    if (indexSrc === indexDst + 1) {
      mem[indexSrc].free += mem[indexDst].free;
      mem[indexDst].free = 0;
    } else {
      if (indexSrc - indexDst < 10)
        console.log({ round, indexSrc, src, indexDst, dst: mem[indexDst] });
      const newSrc = { ...src, free: mem[indexDst].free - src.used };
      mem[indexDst].free = 0;
      mem[indexSrc - 1].free += src.free + src.used;
      mem = [
        ...mem.slice(0, indexDst + 1),
        newSrc,
        ...mem.slice(indexDst + 1, indexSrc),
        ...mem.slice(indexSrc + 1),
      ];
    }
    //console.log({ round, indexSrc, indexDst });
    //console.log(memToString(mem));
  }
}
console.log(memToChecksum(mem));
