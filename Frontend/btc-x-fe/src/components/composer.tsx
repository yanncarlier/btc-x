import { LoaderCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildCurl,
  composeUnsignedTx,
  formatSats,
  satsToBtc,
  TxComposeError,
  type ComposeResult,
  type TxInput,
  type TxOutput,
} from "@/lib/bitcoin-tx";
import { createTxOnHost } from "@/lib/hosted-api";
import { README_EXAMPLE, SITE, SPLIT_EXAMPLE } from "@/lib/site";
import { cn } from "@/lib/utils";

type DraftInput = { id: string; txid: string; vout: string };
type DraftOutput = { id: string; address: string; amount: string };

type Tab = "hex" | "breakdown" | "request" | "curl";

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "match" }
  | { status: "mismatch"; remote: string }
  | { status: "error"; message: string };

let draftSeq = 1;
function nextId(prefix: string) {
  draftSeq += 1;
  return `${prefix}-${draftSeq}`;
}

function fromExample(example: {
  inputs: readonly { txid: string; vout: number }[];
  outputs: readonly { address: string; amount: number }[];
}): { inputs: DraftInput[]; outputs: DraftOutput[] } {
  return {
    inputs: example.inputs.map((input) => ({
      id: nextId("in"),
      txid: input.txid,
      vout: String(input.vout),
    })),
    outputs: example.outputs.map((output) => ({
      id: nextId("out"),
      address: output.address,
      amount: String(output.amount),
    })),
  };
}

function parseDrafts(
  inputs: DraftInput[],
  outputs: DraftOutput[],
): { inputs: TxInput[]; outputs: TxOutput[] } {
  return {
    inputs: inputs.map((input, index) => {
      if (!input.txid.trim()) {
        throw new TxComposeError(`Input ${index + 1}: txid is required`);
      }
      const vout = Number(input.vout);
      if (!Number.isInteger(vout) || vout < 0) {
        throw new TxComposeError(`Input ${index + 1}: vout must be an integer`);
      }
      return { txid: input.txid.trim(), vout };
    }),
    outputs: outputs.map((output, index) => {
      if (!output.address.trim()) {
        throw new TxComposeError(`Output ${index + 1}: address is required`);
      }
      const amount = Number(output.amount);
      if (!Number.isInteger(amount) || amount < 0) {
        throw new TxComposeError(
          `Output ${index + 1}: amount must be an integer in satoshis`,
        );
      }
      return { address: output.address.trim(), amount };
    }),
  };
}

export function Composer() {
  const [inputs, setInputs] = useState<DraftInput[]>([
    {
      id: "in-0",
      txid: README_EXAMPLE.inputs[0].txid,
      vout: String(README_EXAMPLE.inputs[0].vout),
    },
  ]);
  const [outputs, setOutputs] = useState<DraftOutput[]>([
    {
      id: "out-0",
      address: README_EXAMPLE.outputs[0].address,
      amount: String(README_EXAMPLE.outputs[0].amount),
    },
  ]);
  const [tab, setTab] = useState<Tab>("hex");
  const [verify, setVerify] = useState<VerifyState>({ status: "idle" });

  const composed = useMemo(() => {
    try {
      const payload = parseDrafts(inputs, outputs);
      return {
        ok: true as const,
        payload,
        result: composeUnsignedTx(payload.inputs, payload.outputs),
      };
    } catch (error) {
      const message =
        error instanceof TxComposeError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Could not compose transaction";
      return { ok: false as const, error: message };
    }
  }, [inputs, outputs]);

  function loadExample(
    example: typeof README_EXAMPLE | typeof SPLIT_EXAMPLE,
  ) {
    const next = fromExample(example);
    setInputs(next.inputs);
    setOutputs(next.outputs);
    setVerify({ status: "idle" });
    setTab("hex");
  }

  async function verifyHosted() {
    if (!composed.ok) return;
    setVerify({ status: "loading" });
    const remote = await createTxOnHost({ data: composed.payload });
    if (!remote.ok) {
      setVerify({ status: "error", message: remote.error });
      return;
    }
    if (remote.txHex.trim().toLowerCase() === composed.result.txHex.trim().toLowerCase()) {
      setVerify({ status: "match" });
      return;
    }
    setVerify({ status: "mismatch", remote: remote.txHex });
  }

  return (
    <section
      id="composer"
      className="scroll-mt-24 border-y border-border bg-card/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
              Composer
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-display text-foreground sm:text-4xl">
              Assemble an unsigned transaction
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-normal text-muted-foreground sm:text-base">
              Same contract as <span className="font-mono text-foreground">POST /create_tx</span>.
              Inputs are previous outputs; outputs are mainnet addresses and satoshis.
              The hex is a version-1 raw transaction with empty scriptSigs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadExample(README_EXAMPLE)}
            >
              README example
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadExample(SPLIT_EXAMPLE)}
            >
              Two inputs, two outputs
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <fieldset className="rounded-xl border border-border bg-background p-4 sm:p-5">
              <legend className="px-1 text-xs font-medium tracking-label text-muted-foreground uppercase">
                Inputs
              </legend>
              <div className="flex flex-col gap-4">
                {inputs.map((input, index) => (
                  <div
                    key={input.id}
                    className="rounded-sm border border-border bg-card p-3 sm:p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-mono text-xs text-subtle">
                        vin[{index}]
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-11 text-muted-foreground"
                        disabled={inputs.length === 1}
                        aria-label={`Remove input ${index + 1}`}
                        onClick={() => {
                          setInputs((current) =>
                            current.filter((row) => row.id !== input.id),
                          );
                          setVerify({ status: "idle" });
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <Label htmlFor={`${input.id}-txid`}>txid</Label>
                        <Input
                          id={`${input.id}-txid`}
                          value={input.txid}
                          spellCheck={false}
                          autoComplete="off"
                          autoCorrect="off"
                          className="font-mono text-xs sm:text-sm"
                          onChange={(event) => {
                            const value = event.target.value;
                            setInputs((current) =>
                              current.map((row) =>
                                row.id === input.id ? { ...row, txid: value } : row,
                              ),
                            );
                            setVerify({ status: "idle" });
                          }}
                        />
                      </div>
                      <div className="flex w-32 flex-col gap-1.5">
                        <Label htmlFor={`${input.id}-vout`}>vout</Label>
                        <Input
                          id={`${input.id}-vout`}
                          value={input.vout}
                          inputMode="numeric"
                          className="font-mono tabular-nums"
                          onChange={(event) => {
                            const value = event.target.value;
                            setInputs((current) =>
                              current.map((row) =>
                                row.id === input.id ? { ...row, vout: value } : row,
                              ),
                            );
                            setVerify({ status: "idle" });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full sm:w-auto"
                onClick={() => {
                  setInputs((current) => [
                    ...current,
                    { id: nextId("in"), txid: "", vout: "0" },
                  ]);
                  setVerify({ status: "idle" });
                }}
              >
                <Plus />
                Add input
              </Button>
            </fieldset>

            <fieldset className="rounded-xl border border-border bg-background p-4 sm:p-5">
              <legend className="px-1 text-xs font-medium tracking-label text-muted-foreground uppercase">
                Outputs
              </legend>
              <div className="flex flex-col gap-4">
                {outputs.map((output, index) => {
                  const amount = Number(output.amount);
                  const amountHint =
                    Number.isInteger(amount) && amount >= 0
                      ? `${satsToBtc(amount)}`
                      : null;
                  return (
                    <div
                      key={output.id}
                      className="rounded-sm border border-border bg-card p-3 sm:p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-mono text-xs text-subtle">
                          vout[{index}]
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-11 text-muted-foreground"
                          disabled={outputs.length === 1}
                          aria-label={`Remove output ${index + 1}`}
                          onClick={() => {
                            setOutputs((current) =>
                              current.filter((row) => row.id !== output.id),
                            );
                            setVerify({ status: "idle" });
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <Label htmlFor={`${output.id}-address`}>address</Label>
                          <Input
                            id={`${output.id}-address`}
                            value={output.address}
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            className="font-mono text-xs sm:text-sm"
                            onChange={(event) => {
                              const value = event.target.value;
                              setOutputs((current) =>
                                current.map((row) =>
                                  row.id === output.id
                                    ? { ...row, address: value }
                                    : row,
                                ),
                              );
                              setVerify({ status: "idle" });
                            }}
                          />
                        </div>
                        <div className="flex max-w-xs flex-col gap-1.5">
                          <Label htmlFor={`${output.id}-amount`}>
                            amount (sats)
                          </Label>
                          <Input
                            id={`${output.id}-amount`}
                            value={output.amount}
                            inputMode="numeric"
                            className="font-mono tabular-nums"
                            onChange={(event) => {
                              const value = event.target.value;
                              setOutputs((current) =>
                                current.map((row) =>
                                  row.id === output.id
                                    ? { ...row, amount: value }
                                    : row,
                                ),
                              );
                              setVerify({ status: "idle" });
                            }}
                          />
                          {amountHint ? (
                            <p className="text-xs tabular-nums text-subtle">
                              {amountHint}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full sm:w-auto"
                onClick={() => {
                  setOutputs((current) => [
                    ...current,
                    { id: nextId("out"), address: "", amount: "0" },
                  ]);
                  setVerify({ status: "idle" });
                }}
              >
                <Plus />
                Add output
              </Button>
            </fieldset>
          </div>

          <div className="flex min-w-0 flex-col lg:sticky lg:top-20 lg:self-start">
            <ResultPanel
              composed={composed}
              tab={tab}
              onTabChange={setTab}
              verify={verify}
              onVerify={verifyHosted}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultPanel({
  composed,
  tab,
  onTabChange,
  verify,
  onVerify,
}: {
  composed:
    | { ok: true; payload: { inputs: TxInput[]; outputs: TxOutput[] }; result: ComposeResult }
    | { ok: false; error: string };
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  verify: VerifyState;
  onVerify: () => void;
}) {
  const txHex = composed.ok ? composed.result.txHex : "";
  const requestJson = composed.ok
    ? JSON.stringify(composed.payload, null, 2)
    : "";
  const curl = composed.ok
    ? buildCurl(composed.payload, SITE.hostedApi)
    : "";

  const tabs: { id: Tab; label: string }[] = [
    { id: "hex", label: "Hex" },
    { id: "breakdown", label: "Breakdown" },
    { id: "request", label: "Request" },
    { id: "curl", label: "curl" },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
        <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
          Unsigned transaction
        </p>
        {composed.ok ? (
          <p className="font-mono text-xs tabular-nums text-subtle">
            {composed.result.byteLength} B · {composed.result.inputCount} in ·{" "}
            {composed.result.outputCount} out · {formatSats(composed.result.totalSats)}
          </p>
        ) : null}
      </div>

      <div className="flex gap-1 overflow-x-auto px-3 pt-3 sm:px-4">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "h-11 shrink-0 rounded-md px-3 text-sm transition-colors duration-150",
              tab === item.id
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={tab === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="min-h-72 min-w-0 flex-1 p-3 sm:p-4">
        {!composed.ok ? (
          <p
            role="status"
            className="rounded-lg border border-border bg-card px-3 py-3 text-sm text-destructive"
          >
            {composed.error}
          </p>
        ) : tab === "hex" ? (
          <pre className="max-h-80 overflow-auto break-all whitespace-pre-wrap rounded-lg bg-card p-3 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
            {txHex}
          </pre>
        ) : tab === "breakdown" ? (
          <div className="max-h-80 overflow-auto">
            {composed.result.slices.map((slice, index) => (
              <div key={`${slice.label}-${index}`} className="hex-row">
                <span className="text-xs text-muted-foreground">{slice.label}</span>
                <span className="min-w-0 break-all font-mono text-xs text-foreground">
                  {slice.hex}
                </span>
                {slice.note ? (
                  <span className="text-xs text-subtle">{slice.note}</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : tab === "request" ? (
          <pre className="max-h-80 overflow-auto break-all whitespace-pre-wrap rounded-lg bg-card p-3 font-mono text-xs leading-relaxed text-foreground">
            {requestJson}
          </pre>
        ) : (
          <pre className="max-h-80 overflow-auto break-all whitespace-pre-wrap rounded-lg bg-card p-3 font-mono text-xs leading-relaxed text-foreground">
            {curl}
          </pre>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex flex-wrap gap-2">
          <CopyButton text={txHex} label="Copy hex" />
          <CopyButton text={curl} label="Copy curl" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onVerify}
          disabled={!composed.ok || verify.status === "loading"}
        >
          {verify.status === "loading" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ShieldCheck />
          )}
          Verify on hosted API
        </Button>
      </div>

      {verify.status !== "idle" ? (
        <p
          role="status"
          className={cn(
            "border-t border-border px-4 py-3 text-sm",
            verify.status === "match" && "text-ok",
            verify.status === "mismatch" && "text-destructive",
            verify.status === "error" && "text-destructive",
            verify.status === "loading" && "text-muted-foreground",
          )}
        >
          {verify.status === "loading"
            ? `Posting to ${SITE.hostedApi}/create_tx…`
            : verify.status === "match"
              ? "Hosted API returned the same hex."
              : verify.status === "mismatch"
                ? "Hosted API returned a different hex than this composer."
                : verify.message}
        </p>
      ) : null}
    </div>
  );
}
