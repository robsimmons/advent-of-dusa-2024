// node src/7b.js < data/day7-test.txt

import { readFileSync } from "fs";
import { jsonToFacts } from "./util.js";
import { compile, Dusa } from "dusa";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const [k, v] = line.trim().split(": ");
    return { test: parseInt(k), eqn: v.split(" ").map((x) => parseInt(x)) };
  });

const seeker = compile(`
# # SOME MATH # # 

#builtin INT_PLUS plus
#builtin INT_TIMES times
#builtin NAT_SUCC s

#lazy find_mag
find_mag N Mag is Mag :- Mag > N, Mag <= times N 10.
find_mag N Mag is Mag' :-
   Mag <= N,
   find_mag N (times Mag 10) is Mag'.

#lazy magnitude
magnitude N is (find_mag N 10).

#lazy concat
concat A B is (plus (times A Mag) B) :-
   magnitude B is Mag.

#lazy max
max A B C is A :- A >= B, A >= C.
max A B C is B :- B >= A, B >= C.
max A B C is C :- C >= A, C >= B.

#lazy min
min A B C is A :- A <= B, A <= C.
min A B C is B :- B <= A, B <= C.
min A B C is C :- C <= A, C <= B.

# # SEARCH # #

high_water I V I is V :- possible_accum I V.
high_water I' V' (s I) is VNext :-
   high_water I' V' I is V,
   max 
      (plus V (eqn_item I))
      (times V (eqn_item I))
      (concat V (eqn_item I))
   is VNext.

low_water I V I is V :- possible_accum I V.
low_water I' V' (s I) is VNext :-
   low_water I' V' I is V,
   min
      (plus V (eqn_item I))
      (times V (eqn_item I))
      (concat V (eqn_item I))
   is VNext.

# Accumulation always starts with the value in index 0
possible_accum 1 V :- eqn_item 0 is V.

# Finish immediately if low water or high water is finish
possible_accum Len Goal :-
   eqn_length is Len,
   eqn_goal is Goal,
   possible_accum I V,
   low_water I V Len is Goal.
possible_accum Len Goal :-
   eqn_length is Len,
   eqn_goal is Goal,
   possible_accum I V,
   high_water I V Len is Goal.

# Continue with single steps if the target is between low water & high water
possible_accum (plus I 1) (plus V (eqn_item I)) :-
   eqn_length is Len,
   eqn_goal is Goal,
   possible_accum I V, 
   low_water I V Len < Goal,
   high_water I V Len > Goal.
possible_accum (plus I 1) (times V (eqn_item I)) :-
   eqn_length is Len,
   eqn_goal is Goal,
   possible_accum I V, 
   low_water I V Len < Goal,
   high_water I V Len > Goal.
possible_accum (plus I 1) (concat V (eqn_item I)) :-
   eqn_length is Len,
   eqn_goal is Goal,
   possible_accum I V,
   low_water I V Len < Goal,
   high_water I V Len > Goal.

#forbid
   eqn_goal is Goal,
   possible_accum eqn_length Goal.
`);

let accum = 0;
for (const [i, { test, eqn }] of json.entries()) {
  const dusa = new Dusa(seeker);
  dusa.assert(
    { name: "eqn_length", value: eqn.length },
    { name: "eqn_goal", value: test },
    ...eqn.map((value, i) => ({ name: "eqn_item", args: [i], value }))
  );
  if (!dusa.solution) {
    console.log(`Success for test ${i}: got ${test}`);
    accum += test;
  } else {
    console.log(`Failure for test ${i}: did not get ${test}`);
  }
}
console.log(`Answer: ${accum}`);
