export type Polymerization = {
  pairCounters: Map<string, number>;
  charactersCounters: Map<string, number>;
  pairInsertion: Map<string, string>;
};

const pairInsertionRegex = /(\w+) -> (\w+)/;

export function createPolymerization(input: string[]): Polymerization {
  let template = "";
  const pairInsertion: Map<string, string> = new Map();
  const charactersCounters: Map<string, number> = new Map();

  for (const line of input) {
    if (line === "") {
      continue;
    }

    const match = line.match(pairInsertionRegex);

    if (match === null) {
      template = line;
      continue;
    }

    pairInsertion.set(match[1], match[2]);
  }

  let pairCounters: Map<string, number> = new Map();

  for (let i = 0; i < template.length - 1; i++) {
    const pair = `${template[i]}${template[i + 1]}`;

    pairCounters.set(pair, (pairCounters.get(pair) ?? 0) + 1);
  }

  for (let i = 0; i < template.length; i++) {
    charactersCounters.set(
      template[i],
      (charactersCounters.get(template[i]) ?? 0) + 1
    );
  }

  return { pairCounters, pairInsertion, charactersCounters };
}

export function applyPolymerization(
  polymerization: Polymerization
): Polymerization {
  const pairCounters: Map<string, number> = new Map(
    polymerization.pairCounters
  );

  const charactersCounters: Map<string, number> = new Map(
    polymerization.charactersCounters
  );

  for (const [pair, counter] of polymerization.pairCounters) {
    if (counter < 1) {
      continue;
    }

    const character = polymerization.pairInsertion.get(pair)!;
    const firstNewPair = pair[0] + character;
    const secondNewPair = character + pair[1];

    pairCounters.set(pair, (pairCounters.get(pair) ?? 0) - counter);
    pairCounters.set(
      firstNewPair,
      (pairCounters.get(firstNewPair) ?? 0) + counter
    );
    pairCounters.set(
      secondNewPair,
      (pairCounters.get(secondNewPair) ?? 0) + counter
    );
    charactersCounters.set(
      character,
      (charactersCounters.get(character) ?? 0) + counter
    );
  }

  return {
    pairCounters,
    charactersCounters,
    pairInsertion: polymerization.pairInsertion,
  };
}

export function computeScore(polymerization: Polymerization): number {
  let mostCommonCharacterCount = polymerization.charactersCounters.get("N")!;
  let leastCommonCharacterCount = polymerization.charactersCounters.get("N")!;

  for (const [_, count] of polymerization.charactersCounters) {
    if (count > mostCommonCharacterCount) {
      mostCommonCharacterCount = count;
    }

    if (count < leastCommonCharacterCount) {
      leastCommonCharacterCount = count;
    }
  }

  return mostCommonCharacterCount - leastCommonCharacterCount;
}
