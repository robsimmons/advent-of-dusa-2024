// node src/17a.js < data/day17-test.txt

import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const [ra, rb, rc, _prog] = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .filter((x) => x.trim() !== "")
  .map((line) => line.split(": ")[1].trim());

let pc = 0n;
let [a, b, c] = [BigInt(ra), BigInt(rb), BigInt(rc)];
const prog = _prog.split(",");

function combo(op) {
  switch (op) {
    case "0":
    case "1":
    case "2":
    case "3":
      return BigInt(op);
    case "4":
      return a;
    case "5":
      return b;
    case "6":
      return c;
  }
}

const output = [];

for (;;) {
  console.log({ a, b, c, pc, output });
  const opcode = prog[pc];
  if (!opcode) break;
  const oper = prog[pc + 1n];
  console.log({ opcode, oper, combo: combo(oper) });
  pc += 2n;

  switch (opcode) {
    case "0": {
      a = a >> combo(oper);
      break;
    }
    case "1": {
      b = b ^ BigInt(oper);
      break;
    }
    case "2": {
      b = combo(oper) % 8n;
      break;
    }
    case "3": {
      if (a !== 0n) pc = BigInt(oper);
      break;
    }
    case "4": {
      b = b ^ c;
      break;
    }
    case "5": {
      output.push(combo(oper) % 8n);
      break;
    }
    case "6": {
      b = a >> combo(oper);
      break;
    }
    case "7": {
      c = a >> combo(oper);
      break;
    }
  }
}

console.log(output.join(","));

// Confirming part 2 works as expected
const o2 = [];
let a2 = BigInt(ra);
for (;;) {
  const n1 = (a2 & 7n) ^ 5n;
  const n2 = (a2 & 7n) ^ 3n;

  o2.push(n2 ^ ((a2 >> n1) & 7n));
  a2 = a2 >> 3n;
  if (a2 === 0n) break;
}
console.log(o2.join(","));
