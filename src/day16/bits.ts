export type Packet = { message: string; content: string; version: number } & (
  | {
      type: "totalLength";
      totalLength: number;
      subPackets: Packet[];
    }
  | {
      type: "numberOfSubPackets";
      numberOfSubPackets: number;
      subPackets: Packet[];
    }
  | {
      type: "literalValue";
      literalValue: string;
    }
);

export function decodePacket(message: string): Packet {
  const version = parseInt(message.slice(0, 3), 2);
  const typeId = parseInt(message.slice(3, 6), 2);

  const parsedTypeId = parseTypeId(typeId);

  if (parsedTypeId === "literalValue") {
    const { literalValue, endIndex } = parseLiteralValue(message.slice(6));
    const content = message.slice(6, 6 + endIndex);

    return {
      type: "literalValue",
      version,
      message: message.slice(0, 6 + endIndex),
      content,
      literalValue,
    };
  }

  const lengthTypeId = parseInt(message.slice(6, 7), 2);
  const parsedLengthTypeId = parseLengthTypeId(lengthTypeId);

  if (parsedLengthTypeId === "totalLength") {
    const lengthStart = 7;
    const subPacketStart = 7 + 15;

    const totalLength = parseInt(message.slice(lengthStart, subPacketStart), 2);
    const subPackets: Packet[] = [];
    let content = message.slice(subPacketStart, totalLength + subPacketStart);

    let rawSubPackets = content;
    while (rawSubPackets.replaceAll("0", "").length > 0) {
      const subPacket = decodePacket(rawSubPackets);

      subPackets.push(subPacket);
      rawSubPackets = rawSubPackets.slice(subPacket.message.length);
    }

    return {
      type: "totalLength",
      version,
      message: message.slice(0, totalLength + subPacketStart),
      content,
      totalLength,
      subPackets,
    };
  }

  if (parsedLengthTypeId === "numberOfSubPackets") {
    const numberOfSubPacketStart = 7;
    const subPacketStart = 7 + 11;

    const numberOfSubPackets = parseInt(
      message.slice(numberOfSubPacketStart, subPacketStart),
      2
    );

    const subPackets: Packet[] = [];
    let totalLength = 0;
    let content = message.slice(subPacketStart);

    let subPacketsLeft = numberOfSubPackets;
    let rawSubPackets = content;
    while (subPacketsLeft > 0) {
      const subPacket = decodePacket(rawSubPackets);

      subPackets.push(subPacket);
      totalLength += subPacket.message.length;
      rawSubPackets = rawSubPackets.slice(subPacket.message.length);
      subPacketsLeft -= 1;
    }

    content = message.slice(subPacketStart, totalLength + subPacketStart);

    return {
      type: "numberOfSubPackets",
      version,
      message: message.slice(0, totalLength + subPacketStart),
      content,
      numberOfSubPackets,
      subPackets: subPackets,
    };
  }

  throw new Error("Unknown packet type");
}

function parseLiteralValue(packet: string) {
  let keepReading = false;
  let i = 0;

  const blocks: string[] = [];

  do {
    const block = packet.slice(i + 1, i + 5);
    blocks.push(block);

    keepReading = packet.at(i) === "1";
    i += 5;
  } while (keepReading);

  return { literalValue: parseInt(blocks.join(""), 2).toString(), endIndex: i };
}

function parseTypeId(input: number): "literalValue" | "operator" {
  if (input === 4) {
    return "literalValue";
  }

  return "operator";
}

function parseLengthTypeId(
  input: number
): "totalLength" | "numberOfSubPackets" {
  if (input === 1) {
    return "numberOfSubPackets";
  }

  return "totalLength";
}
