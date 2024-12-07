// node src/7b.js < data/day7-test.txt

import { readFileSync } from "fs";
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
find_mag N Mag is Mag' :- Mag <= N, find_mag N (times Mag 10) is Mag'.

#lazy magnitude
magnitude N is (find_mag N 10).

#lazy concat
concat A B is (plus (times A Mag) B) :- magnitude B is Mag.

#lazy max
max A B C is A :- A >= B, A >= C.
max A B C is B :- B >= A, B >= C.
max A B C is C :- C >= A, C >= B.

#lazy min
min A B C is A :- A <= B, A <= C.
min A B C is B :- B <= A, B <= C.
min A B C is C :- C <= A, C <= B.

# # SEARCH # #

# Always calculate the maximum and minimum possible outcomes with an eye
# towards cutting off infeasible search paths early.
high_water I V I is V :- accum I is V.
high_water I' V' (s I) is VNext :-
    high_water I' V' I is V,
    max (plus V (eqn_item I))
        (times V (eqn_item I))
        (concat V (eqn_item I))
    is VNext.

low_water I V I is V :- accum I is V.
low_water I' V' (s I) is VNext :-
    low_water I' V' I is V,
    min (plus V (eqn_item I))
        (times V (eqn_item I))
        (concat V (eqn_item I))
    is VNext.

# Accumulation always starts with the value in index 0
accum 1 is V :- eqn_item 0 is V.

# Bail immediately if low water or high water is infeasible
#forbid accum I is V, eqn_length is Len, eqn_goal is Goal, low_water I V Len is Low, Low > Goal.
#forbid accum I is V, eqn_length is Len, eqn_goal is Goal, low_water I V Len is Low, Low > Goal.
#forbid accum I is V, eqn_length is Len, eqn_goal is Goal, high_water I V Len < Goal.

# Continue with single steps if the target is between low water & high water
next I V :-
    eqn_length is Len,
    eqn_goal is Goal,
    accum I is V.

accum (s I) is? (plus V (eqn_item I)) :- next I V.
accum (s I) is? (times V (eqn_item I)) :- next I V.
accum (s I) is? (concat V (eqn_item I)) :- next I V, use_concat.

#demand eqn_length is _.
#demand eqn_goal is _.
#demand eqn_item _ is _.
`);

let part1 = 0;
let part2 = 0;
for (const [i, { test, eqn }] of json.entries()) {
  const dusa = new Dusa(seeker);
  dusa.assert(
    { name: "eqn_length", value: eqn.length },
    { name: "eqn_goal", value: test },
    ...eqn.map((value, i) => ({ name: "eqn_item", args: [i], value }))
  );
  if (dusa.solution) {
    console.log(`Success w/o concat for test ${i}: got ${test}`);
    part1 += test;
    part2 += test;
  } else {
    dusa.assert({ name: "use_concat" });
    if (dusa.solution) {
      console.log(`Success w/concat for test ${i}: got ${test}`);
      // console.log(dusa.solution.facts());
      part2 += test;
    } else {
      console.log(`Failure for test ${i}: did not get ${test}`);
    }
  }
}
console.log(`Part 1 answer: ${part1}`);
console.log(`Part 2 answer: ${part2}`);
