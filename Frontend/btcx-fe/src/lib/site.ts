export const SITE = {
  name: "BTCX",
  product: "Bitcoin Transaction API",
  tagline: "Unsigned Bitcoin transactions over HTTP.",
  description:
    "A small Rust API that assembles unsigned Bitcoin transactions from inputs and outputs, then returns consensus-serialized hex. Signing stays with you.",
  github: "https://github.com/yanncarlier/btcx_api",
  hostedApi:
    typeof process !== "undefined" ? process.env.BTCX_API_URL ?? "https://btcx-api.fly.dev" : "https://btcx-api.fly.dev",
  endpoint:
    typeof process !== "undefined" ? process.env.BTCX_API_ENDPOINT ?? "/create_tx" : "/create_tx",
  version: "0.1.0",
} as const;

export const README_EXAMPLE = {
  inputs: [
    {
      txid: "5df6e0e2761359d30a8275058e2678ab78211f49fdf87c8ac664586000000000",
      vout: 0,
    },
  ],
  outputs: [
    {
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      amount: 100_000,
    },
  ],
  txHex:
    "010000000100000000605864c68a7cf8fd491f2178ab78268e0575820ad3591376e2e0f65d0000000000ffffffff01a0860100000000001976a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac00000000",
} as const;

export const SPLIT_EXAMPLE = {
  inputs: [
    {
      txid: "5df6e0e2761359d30a8275058e2678ab78211f49fdf87c8ac664586000000000",
      vout: 0,
    },
    {
      txid: "5df6e0e2761359d30a8275058e2678ab78211f49fdf87c8ac664586000000001",
      vout: 1,
    },
  ],
  outputs: [
    {
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      amount: 50_000,
    },
    {
      address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      amount: 50_000,
    },
  ],
} as const;
