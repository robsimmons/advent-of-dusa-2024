// node src/16a.js < data/day16-test.txt

import { Dusa } from "dusa";
import { readFileSync } from "fs";
import { factToString, jsonToFacts } from "./util.js";

const json = readFileSync(0, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));
const facts = jsonToFacts(json);

const dusa = new Dusa(`
#builtin INT_PLUS plus
#builtin INT_MINUS minus
#builtin NAT_SUCC s

dir 0 -1. dir 0 1. dir -1 0. dir 1 0.

turn (tuple 0 -1) (tuple 1 0). turn (tuple 0 -1) (tuple 1 0).
turn (tuple 0 1) (tuple 1 0). turn (tuple 0 1) (tuple 1 0).
turn (tuple -1 0) (tuple 0 1). turn (tuple -1 0) (tuple 0 -1).
turn (tuple 1 0) (tuple 0 1). turn (tuple 1 0) (tuple 0 -1).

#lazy turncost
turncost X Y X Y is 0.
turncost X 0 0 Y' is 1000. 
turncost 0 Y' X 0 is 1000.
turncost X Y X' Y' is 2000 :- minus 0 X is X', minus 0 Y is Y'.

pos X Y is Ch :-
    root 0 is Root,
    field Root Y is Line,
    field Line X is Ch, Ch != "#".

dead X Y is tt :-
    root 0 is Root,
    field Root Y is Line,
    field Line X is "#".

dead X Y is tt :-
    dir DX1 DY1, dir DX2 DY2, tuple DX1 DY1 != tuple DX2 DY2,
    dir DX3 DY3, tuple DX1 DY1 != tuple DX3 DY3,
    tuple DX2 DY2 != tuple DX3 DY3,
    pos X Y is Ch, Ch != "E", Ch != "S",
    dead (plus DX1 X) (plus DY1 Y) is tt,
    dead (plus DX2 X) (plus DY2 Y) is tt,
    dead (plus DX3 X) (plus DY3 Y) is tt.
dead X Y is? ff :- pos X Y is _.


start is (tuple X Y) :- pos X Y is "S".
end is (tuple X Y) :- pos X Y is "E".
nexus X Y :- start is (tuple X Y).
nexus X Y :- end is (tuple X Y).
nexus X Y :-
    dir DX1 DY1, dir DX2 DY2, tuple DX1 DY1 != tuple DX2 DY2,
    dir DX3 DY3, tuple DX1 DY1 != tuple DX3 DY3,
    tuple DX2 DY2 != tuple DX3 DY3,
    dead X Y is ff,
    dead (plus DX1 X) (plus DY1 Y) is ff,
    dead (plus DX2 X) (plus DY2 Y) is ff,
    dead (plus DX3 X) (plus DY3 Y) is ff.

`);
dusa.assert(...facts);

const dusa2 = new Dusa(`
#builtin BOOLEAN_TRUE tt
#builtin BOOLEAN_FALSE ff
#builtin INT_PLUS plus
#builtin INT_MINUS minus
#builtin INT_TIMES times
#builtin NAT_SUCC s

dir 0 -1. dir 0 1. dir -1 0. dir 1 0.
sign 1. sign -1.

out X Y DX DY :-
    nexus X Y is tt,
    dir DX DY,
    pos (plus X DX) (plus Y DY).

forced (tuple X Y DX DY) (plus X DX) (plus Y DY) DX DY 1 0 :-
    out X Y DX DY.

forced Start (plus X DX) (plus Y DY) DX DY (plus 1 Cost) (s Len) :-
    forced Start X Y DX DY Cost Len,
    nexus X Y is ff,
    pos (plus X DX) (plus Y DY).

forced Start (plus X DX') (plus Y DY') DX' DY' (plus 1001 Cost) (s Len):-
    sign S,
    forced Start X Y DX DY Cost Len,
    nexus X Y is ff,
    DX' == times S DY, DY' == times S DX,
    pos (plus X DX') (plus Y DY').

edge Start (tuple X Y DX DY) is Cost :-
    forced Start X Y DX DY Cost _,
    out X Y DX DY.
edge Start (tuple X Y DX DY) is Cost :-
    forced Start X Y DX DY Cost _,
    end X Y.
edge Start (tuple X Y DX' DY') is (plus Cost 1000) :-
    forced Start X Y DX DY Cost _,
    nexus X Y is tt, sign S,
    DX' == times S DY, DY' == times S DX,
    out X Y DX' DY'.
edge (tuple X Y 1 0) (tuple X Y 0 -1) is 1000 :-
    start X Y.

length V X Y is Len :-
    edge V V' is _, V' == tuple X Y _ _,
    forced V X Y _ _ _ Len.
length (tuple X Y 1 0) X Y is 0 :-
    start X Y.

reachable 0 is (tuple X Y 1 0) :- start X Y.
cost 0 is 0.

done is C :- end X Y, costto (tuple X Y _ _) is C.

costto (tuple X Y 1 0) is 0 :- start X Y.

frontier_candidate V' (plus Cost Cost') :- 
    costto V is Cost, edge V V' is Cost'.

frontier_real V Cost is? valid :- frontier_candidate V Cost.
frontier_real V Cost is invalid :- frontier_candidate V Cost, costto V is _.
frontier V Cost (plus Cost (minus X' X) (minus Y Y')) :- 
    frontier_real V Cost is valid,
    V == tuple X Y _ _,
    end X' Y'.

fastpath_node V :- end X Y, costto V is _, V == tuple X Y _ _.
fastpath_node V' :-
    fastpath_node V, costto V is Cost,
    edge V' V is DCost, costto V' is Cost',
    Cost == plus Cost' DCost.

fastpath_edge V' V :-
    fastpath_node V, costto V is Cost,
    edge V' V is DCost, costto V' is Cost',
    Cost == plus Cost' DCost.

on_fastpath X Y :- fastpath_node (tuple X Y _ _).
forced_fastpath V X Y is Len :- 
    fastpath_edge V (tuple X Y _ _),
    length V X Y is Len.


`);
dusa2.assert(
  { name: "start", args: dusa.solution.get("start").args },
  { name: "end", args: dusa.solution.get("end").args },
  ...[...dusa.solution.lookup("dead")].flatMap(([x, y, dead]) => {
    if (dead?.name === "ff") {
      return [
        { name: "pos", args: [x, y] },
        {
          name: "nexus",
          args: [x, y],
          value: dusa.solution.has("nexus", x, y),
        },
      ];
    }
    return [];
  })
);

console.log(
  json
    .map((line, y) =>
      line
        .map((char, x) =>
          char === "#"
            ? "#"
            : dusa.solution.get("dead", x, y)?.name === "tt"
            ? "*"
            : dusa.solution.has("nexus", x, y)
            ? "."
            : " "
        )
        .join("")
    )
    .join("\n")
);
while (!dusa2.solution.has("done")) {
  const [v, c] = [...dusa2.solution.lookup("frontier")].reduce((x, y) => {
    if (!x) return y;
    if (x[2] < y[2]) return x;
    return y;
  });
  dusa2.assert({ name: "costto", args: [v], value: c });
  console.log({ v, c });
}
console.log(
  json
    .map((line, y) =>
      line
        .map((char, x) =>
          char === "#"
            ? "#"
            : dusa.solution.get("dead", x, y)?.name === "tt"
            ? "*"
            : dusa.solution.has("nexus", x, y)
            ? dusa2.solution.has("on_fastpath", x, y)
              ? "%"
              : "."
            : " "
        )
        .join("")
    )
    .join("\n")
);
console.log(
  [...dusa2.solution.lookup("on_fastpath")].length +
    [...dusa2.solution.lookup("forced_fastpath")].reduce(
      (accum, [_v, _x, _y, len]) => len + accum,
      0
    )
);
