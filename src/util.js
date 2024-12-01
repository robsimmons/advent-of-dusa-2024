import { termToString } from "dusa";

/* function jsonToFacts_(
  ref: { current: number },
  data: any
): { term: Term; facts: Fact[] } { */
function jsonToFacts_(ref, data) {
  if (
    data === null ||
    typeof data === "bigint" ||
    typeof data === "boolean" ||
    typeof data === "number" ||
    typeof data === "string"
  ) {
    return { term: data, facts: [] };
  }

  const root = ref.current++;
  if (Array.isArray(data)) {
    return {
      term: root,
      facts: [
        [[{ name: "length", args: [root], value: data.length }]],
        ...data.entries().map(([i, sub]) => {
          const { term, facts } = jsonToFacts_(ref, sub);
          return [[{ name: "field", args: [root, i], value: term }], facts];
        }),
      ].flat(2),
    };
  }

  return {
    term: root,
    facts: Object.entries(data)
      .map(([k, v]) => {
        const { term, facts } = jsonToFacts_(ref, v);
        return [[{ name: "field", args: [root, k], value: term }], facts];
      })
      .flat(2),
  };
}

let globalCount = 0;
const globalRef = { current: 0 };
export function jsonToFacts(data) {
  const { term, facts } = jsonToFacts_(globalRef, data);
  return [{ name: "root", args: [globalCount++], value: term }, ...facts];
}

export function factToString(fact) {
  return `${fact.name}${fact.args
    .map((tm) => ` ${termToString(tm, true)}`)
    .join("")}${
    fact.value === undefined ? "" : ` is ${termToString(fact.value, true)}`
  }`;
}
