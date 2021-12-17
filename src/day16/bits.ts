export type Packet = {
  message: string;
  content: string;
  version: number;
  value: number;
} & (
  | {
      type: "totalLength";
      operation: Operation;
      totalLength: number;
      subPackets: Packet[];
    }
  | {
      type: "numberOfSubPackets";
      operation: Operation;
      value: number;
      numberOfSubPackets: number;
      subPackets: Packet[];
    }
  | {
      type: "literalValue";
    }
);

export type Operation =
  | "sum"
  | "product"
  | "minimum"
  | "maximum"
  | "greaterThan"
  | "lessThan"
  | "equal";

export function decodePacket(message: string): Packet {
  const version = parseInt(message.slice(0, 3), 2);
  const typeId = parseInt(message.slice(3, 6), 2);

  const parsedTypeId = parseTypeId(typeId);

  if (parsedTypeId === "literalValue") {
    const { value, endIndex } = parseLiteralValue(message.slice(6));
    const content = message.slice(6, 6 + endIndex);

    return {
      type: "literalValue",
      version,
      message: message.slice(0, 6 + endIndex),
      content,
      value,
    };
  }

  const lengthTypeId = parseInt(message.slice(6, 7), 2);
  const parsedLengthTypeId = parseLengthTypeId(lengthTypeId);
  const operation = parseOperationTypeId(typeId);

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
      operation,
      value: computeValue(operation, subPackets),
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
      operation,
      value: computeValue(operation, subPackets),
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

  return { value: parseInt(blocks.join(""), 2), endIndex: i };
}

function parseTypeId(input: number): "literalValue" | "operator" {
  if (input === 4) {
    return "literalValue";
  }

  return "operator";
}

function parseOperationTypeId(input: number): Operation {
  switch (input) {
    case 0:
      return "sum";
    case 1:
      return "product";
    case 2:
      return "minimum";
    case 3:
      return "maximum";
    case 5:
      return "greaterThan";
    case 6:
      return "lessThan";
    case 7:
      return "equal";
    default:
      throw new Error("Unknown operator type");
  }
}

function parseLengthTypeId(
  input: number
): "totalLength" | "numberOfSubPackets" {
  if (input === 1) {
    return "numberOfSubPackets";
  }

  return "totalLength";
}

function computeValue(operation: Operation, subPackets: Packet[]) {
  switch (operation) {
    case "sum":
      return subPackets.reduce(
        (result, subPacket) => result + subPacket.value,
        0
      );
    case "product":
      return subPackets.reduce(
        (result, subPacket) => result * subPacket.value,
        1
      );
    case "minimum":
      return Math.min(...subPackets.map((subPacket) => subPacket.value));
    case "maximum":
      return Math.max(...subPackets.map((subPacket) => subPacket.value));
    case "greaterThan":
      if (subPackets.length !== 2) {
        throw new Error("Expected 2 subPackets for greaterThan");
      }

      return subPackets[0].value > subPackets[1].value ? 1 : 0;
    case "lessThan":
      if (subPackets.length !== 2) {
        throw new Error("Expected 2 subPackets for lessThan");
      }

      return subPackets[0].value < subPackets[1].value ? 1 : 0;
    case "equal":
      if (subPackets.length !== 2) {
        throw new Error("Expected 2 subPackets for equal");
      }

      return subPackets[0].value === subPackets[1].value ? 1 : 0;
    default:
      throw new Error("Unknown operator type");
  }
}
