import { sha256 } from "@noble/hashes/sha2.js";
import { base58check, bech32, bech32m } from "@scure/base";

const b58c = base58check(sha256);

export type TxInput = {
  txid: string;
  vout: number;
};

export type TxOutput = {
  address: string;
  amount: number;
};

export type HexSlice = {
  label: string;
  hex: string;
  note?: string;
};

export type ScriptType = "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "p2tr";

export type ComposeResult = {
  txHex: string;
  slices: HexSlice[];
  inputCount: number;
  outputCount: number;
  totalSats: bigint;
  byteLength: number;
};

export class TxComposeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TxComposeError";
  }
}

function concat(chunks: Uint8Array[]): Uint8Array {
  let length = 0;
  for (const chunk of chunks) length += chunk.length;
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) hex += byte.toString(16).padStart(2, "0");
  return hex;
}

export function fromHex(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0) {
    throw new TxComposeError("Hex string must have even length");
  }
  if (!/^[0-9a-f]*$/.test(clean)) {
    throw new TxComposeError("Hex string contains non-hex characters");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function u32le(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value >>> 0, true);
  return bytes;
}

function u64le(value: bigint): Uint8Array {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, value, true);
  return bytes;
}

function varint(value: number): Uint8Array {
  if (value < 0xfd) return Uint8Array.of(value);
  if (value <= 0xffff) {
    const bytes = new Uint8Array(3);
    bytes[0] = 0xfd;
    new DataView(bytes.buffer).setUint16(1, value, true);
    return bytes;
  }
  if (value <= 0xffffffff) {
    const bytes = new Uint8Array(5);
    bytes[0] = 0xfe;
    new DataView(bytes.buffer).setUint32(1, value, true);
    return bytes;
  }
  const bytes = new Uint8Array(9);
  bytes[0] = 0xff;
  new DataView(bytes.buffer).setBigUint64(1, BigInt(value), true);
  return bytes;
}

function reverseBytes(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) {
    out[i] = bytes[bytes.length - 1 - i];
  }
  return out;
}

function parseTxid(txid: string): Uint8Array {
  const clean = txid.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(clean)) {
    throw new TxComposeError("txid must be a 64-character hex string");
  }
  return reverseBytes(fromHex(clean));
}

function pushdata(script: Uint8Array): Uint8Array {
  return concat([varint(script.length), script]);
}

function p2pkhScript(hash: Uint8Array): Uint8Array {
  return concat([
    Uint8Array.of(0x76, 0xa9, 0x14),
    hash,
    Uint8Array.of(0x88, 0xac),
  ]);
}

function p2shScript(hash: Uint8Array): Uint8Array {
  return concat([Uint8Array.of(0xa9, 0x14), hash, Uint8Array.of(0x87)]);
}

function witnessScript(version: number, program: Uint8Array): Uint8Array {
  const op = version === 0 ? 0x00 : 0x50 + version;
  return concat([Uint8Array.of(op, program.length), program]);
}

export function addressToScript(address: string): {
  script: Uint8Array;
  type: ScriptType;
} {
  const trimmed = address.trim();
  if (!trimmed) throw new TxComposeError("Address is required");

  if (/^(tb1|bcrt1)/i.test(trimmed)) {
    throw new TxComposeError("Address network mismatch");
  }

  if (trimmed.toLowerCase().startsWith("bc1")) {
    return decodeSegwit(trimmed);
  }

  let payload: Uint8Array;
  try {
    payload = b58c.decode(trimmed);
  } catch {
    throw new TxComposeError("Invalid address");
  }

  if (payload.length !== 21) {
    throw new TxComposeError("Invalid address");
  }

  const version = payload[0];
  const hash = payload.slice(1);

  if (version === 0x00) {
    return { script: p2pkhScript(hash), type: "p2pkh" };
  }
  if (version === 0x05) {
    return { script: p2shScript(hash), type: "p2sh" };
  }
  throw new TxComposeError("Address network mismatch");
}

function decodeSegwit(address: string): { script: Uint8Array; type: ScriptType } {
  const lower = address.toLowerCase();
  let version: number;
  let program: Uint8Array;
  let encoding: "bech32" | "bech32m";

  try {
    const decoded = bech32.decode(lower);
    encoding = "bech32";
    version = decoded.words[0] ?? -1;
    program = bech32.fromWords(decoded.words.slice(1));
    if (decoded.prefix !== "bc") {
      throw new TxComposeError("Address network mismatch");
    }
  } catch (first) {
    if (first instanceof TxComposeError) throw first;
    try {
      const decoded = bech32m.decode(lower);
      encoding = "bech32m";
      version = decoded.words[0] ?? -1;
      program = bech32m.fromWords(decoded.words.slice(1));
      if (decoded.prefix !== "bc") {
        throw new TxComposeError("Address network mismatch");
      }
    } catch (second) {
      if (second instanceof TxComposeError) throw second;
      throw new TxComposeError("Invalid address");
    }
  }

  if (version === 0) {
    if (encoding !== "bech32") throw new TxComposeError("Invalid address");
    if (program.length === 20) {
      return { script: witnessScript(0, program), type: "p2wpkh" };
    }
    if (program.length === 32) {
      return { script: witnessScript(0, program), type: "p2wsh" };
    }
    throw new TxComposeError("Invalid address");
  }

  if (version === 1 && program.length === 32 && encoding === "bech32m") {
    return { script: witnessScript(1, program), type: "p2tr" };
  }

  throw new TxComposeError("Invalid address");
}

const SCRIPT_LABEL: Record<ScriptType, string> = {
  p2pkh: "P2PKH",
  p2sh: "P2SH",
  p2wpkh: "P2WPKH",
  p2wsh: "P2WSH",
  p2tr: "P2TR",
};

export function composeUnsignedTx(
  inputs: TxInput[],
  outputs: TxOutput[],
): ComposeResult {
  if (inputs.length === 0) {
    throw new TxComposeError("At least one input is required");
  }
  if (outputs.length === 0) {
    throw new TxComposeError("At least one output is required");
  }

  const slices: HexSlice[] = [];
  const chunks: Uint8Array[] = [];

  function push(label: string, bytes: Uint8Array, note?: string) {
    chunks.push(bytes);
    slices.push({ label, hex: toHex(bytes), note });
  }

  push("version", u32le(1), "version 1");
  push("input count", varint(inputs.length), `${inputs.length}`);

  inputs.forEach((input, index) => {
    if (!Number.isInteger(input.vout) || input.vout < 0) {
      throw new TxComposeError(`Input ${index + 1}: vout must be a non-negative integer`);
    }
    const txid = parseTxid(input.txid);
    push(`input ${index + 1} txid`, txid, "little-endian");
    push(`input ${index + 1} vout`, u32le(input.vout), String(input.vout));
    push(`input ${index + 1} script_sig`, varint(0), "unsigned — empty");
    push(`input ${index + 1} sequence`, u32le(0xffffffff), "0xffffffff");
  });

  push("output count", varint(outputs.length), `${outputs.length}`);

  let totalSats = 0n;
  outputs.forEach((output, index) => {
    if (!Number.isInteger(output.amount) || output.amount < 0) {
      throw new TxComposeError(
        `Output ${index + 1}: amount must be a non-negative integer in satoshis`,
      );
    }
    const amount = BigInt(output.amount);
    totalSats += amount;
    const { script, type } = addressToScript(output.address);
    push(
      `output ${index + 1} value`,
      u64le(amount),
      `${output.amount.toLocaleString("en-US")} sats`,
    );
    push(
      `output ${index + 1} script`,
      pushdata(script),
      SCRIPT_LABEL[type],
    );
  });

  push("locktime", u32le(0), "0");

  const raw = concat(chunks);
  return {
    txHex: toHex(raw),
    slices,
    inputCount: inputs.length,
    outputCount: outputs.length,
    totalSats,
    byteLength: raw.length,
  };
}

export function formatSats(sats: number | bigint): string {
  return `${BigInt(sats).toLocaleString("en-US")} sats`;
}

export function satsToBtc(sats: number | bigint): string {
  const value = Number(sats) / 100_000_000;
  return `${value.toFixed(8).replace(/0+$/, "").replace(/\.$/, "")} BTC`;
}

export function buildCurl(payload: { inputs: TxInput[]; outputs: TxOutput[] }, baseUrl: string): string {
  const body = JSON.stringify(payload, null, 2);
  return `curl -X POST ${baseUrl}/create_tx \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
}
