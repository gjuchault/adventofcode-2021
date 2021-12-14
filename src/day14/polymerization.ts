export type Polymerization = {
  template: string;
  pairInsertion: Map<string, string>;
};

const pairInsertionRegex = /(\w+) -> (\w+)/;

export function createPolymerization(input: string[]): Polymerization {
  let template = "";
  let pairInsertion: Map<string, string> = new Map();

  for (const line of input) {
    if (line === "") {
      continue;
    }

    const match = pairInsertionRegex.exec(line);

    if (match === null) {
      template = line;
      continue;
    }

    pairInsertion.set(match[1], match[2]);
  }

  return { template, pairInsertion };
}

export function applyPolymerization(
  polymerization: Polymerization
): Polymerization {
  const template = polymerization.template;
  let newTemplate = polymerization.template;

  for (let i = 0; i < template.length - 1; i++) {
    const pair = `${template[i]}${template[i + 1]}`;
    const charToInsert = polymerization.pairInsertion.get(pair);

    if (charToInsert === undefined) {
      continue;
    }

    newTemplate = insertInString(newTemplate, charToInsert, i + i + 1);
  }

  return { template: newTemplate, pairInsertion: polymerization.pairInsertion };
}

export function computeScore(input: string): number {
  const characters = input.split("").reduce<Record<string, number>>(
    (acc, char) => ({
      ...acc,
      [char]: (acc[char] ?? 0) + 1,
    }),
    {}
  );

  let mostCommonCharacterCount = characters.N;
  let leastCommonCharacterCount = characters.N;

  for (const [_, count] of Object.entries(characters)) {
    if (count > mostCommonCharacterCount) {
      mostCommonCharacterCount = count;
    }

    if (count < leastCommonCharacterCount) {
      leastCommonCharacterCount = count;
    }
  }

  return mostCommonCharacterCount - leastCommonCharacterCount;
}

function insertInString(source: string, char: string, index: number): string {
  return source.substring(0, index) + char + source.substring(index);
}
