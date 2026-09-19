import { createServerFn } from "@tanstack/react-start";
import type { TxInput, TxOutput } from "@/lib/bitcoin-tx";
import { SITE } from "@/lib/site";

export type HostedTxResult =
  | { ok: true; txHex: string }
  | { ok: false; error: string };

type CreateTxPayload = {
  inputs: TxInput[];
  outputs: TxOutput[];
};

export const createTxOnHost = createServerFn({ method: "POST" })
  .validator((data: CreateTxPayload) => data)
  .handler(async ({ data }): Promise<HostedTxResult> => {
    try {
      const payload = {
        inputs: data.inputs.map((input) => ({
          txid: input.txid,
          vout: input.vout,
        })),
        outputs: data.outputs.map((output) => ({
          address: output.address,
          amount: output.amount,
        })),
      };
      const response = await fetch(`${SITE.hostedApi}/create_tx`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      const text = await response.text();
      if (!response.ok) {
        return {
          ok: false,
          error: text || `Hosted API returned ${response.status}`,
        };
      }
      let parsed: { tx_hex?: string };
      try {
        parsed = JSON.parse(text) as { tx_hex?: string };
      } catch {
        return { ok: false, error: "Hosted API returned non-JSON" };
      }
      if (!parsed.tx_hex) {
        return { ok: false, error: "Hosted API omitted tx_hex" };
      }
      return { ok: true, txHex: parsed.tx_hex };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Hosted API unreachable";
      return { ok: false, error: message };
    }
  });
