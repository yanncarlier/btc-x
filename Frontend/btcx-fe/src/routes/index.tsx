import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Lock,
  Radio,
  Server,
} from "lucide-react";
import { Composer } from "@/components/composer";
import { CopyButton } from "@/components/copy-button";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Composer />
        <How />
        <Endpoint />
        <Deploy />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-foreground">
          <Mark className="size-7" />
          <span className="font-display text-lg tracking-display">BTCX</span>
        </a>
        <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <a href="#composer" className="hover:text-foreground">
            Composer
          </a>
          <a href="#spec" className="hover:text-foreground">
            Spec
          </a>
          <a href="#endpoint" className="hover:text-foreground">
            Endpoint
          </a>
          <a href="#deploy" className="hover:text-foreground">
            Run
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github />
              GitHub
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="#composer">
              Compose
              <ArrowRight />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-wash ledger-grid relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-28">
        <div>
          <p className="reveal text-xs font-medium tracking-label text-muted-foreground uppercase">
            {SITE.product} · {SITE.version}
            <span className="ml-2 text-destructive">alpha software release</span>
          </p>
          <h1 className="reveal reveal-delay-1 mt-4 max-w-xl font-display text-4xl font-medium tracking-display text-foreground sm:text-5xl lg:text-6xl">
            Compose unsigned Bitcoin transactions over HTTP.
          </h1>
          <p className="reveal reveal-delay-2 mt-5 max-w-lg text-base leading-normal text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#composer">
                Open the composer
                <ArrowRight />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={SITE.github} target="_blank" rel="noreferrer noopener">
                <Github />
                Source
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>

        <aside className="reveal reveal-delay-2 rounded-xl border border-border bg-card p-5 shadow-border sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
              Draft ticket
            </p>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
              unsigned
            </span>
          </div>
          <dl className="mt-5 divide-y divide-border">
            <TicketRow term="Method" value="POST /create_tx" />
            <TicketRow term="Network" value="Bitcoin mainnet" />
            <TicketRow term="Version" value="1" />
            <TicketRow term="Locktime" value="0" />
            <TicketRow term="scriptSig" value="empty" />
            <TicketRow term="Returns" value="{ tx_hex }" />
          </dl>
          <p className="mt-5 font-mono text-xs leading-relaxed break-all text-subtle">
            Hosted at {SITE.hostedApi.replace("https://", "")}
          </p>
        </aside>
      </div>
    </section>
  );
}

function TicketRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-xs tracking-label text-subtle uppercase">{term}</dt>
      <dd className="font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

function How() {
  const steps = [
    {
      n: "01",
      title: "Name the UTXOs",
      body: "Each input is a previous transaction id and the output index you intend to spend. The server does not look up the chain for you.",
    },
    {
      n: "02",
      title: "Set destinations",
      body: "Outputs are mainnet addresses and amounts in satoshis. Mixed address types are fine as long as they belong to Bitcoin mainnet.",
    },
    {
      n: "03",
      title: "Sign somewhere else",
      body: "The response is consensus-serialized hex with empty scriptSigs and an empty witness. Keys never touch this process.",
    },
  ];

  const facts = [
    {
      icon: Lock,
      title: "Unsigned on purpose",
      body: "Signing is omitted so wallets, HSMs, and PSBT flows keep the keys.",
    },
    {
      icon: Radio,
      title: "Mainnet addresses only",
      body: "txid must be 64-character hex. Addresses are checked against Bitcoin mainnet.",
    },
    {
      icon: Server,
      title: "One Actix-web route",
      body: "A small Rust binary. No UTXO index, no fee estimation, no broadcast.",
    },
  ];

  return (
    <section id="spec" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-display sm:text-4xl">
          The server builds the skeleton. You hold the pen.
        </h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="font-display text-2xl text-subtle">{step.n}</p>
              <h3 className="mt-3 text-base font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-normal text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.title} className="flex gap-3 rounded-lg p-1">
              <fact.icon className="mt-0.5 size-4 shrink-0 text-foreground" />
              <div>
                <h3 className="text-sm font-medium text-foreground">{fact.title}</h3>
                <p className="mt-1 text-sm leading-normal text-muted-foreground">
                  {fact.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REQUEST_EXAMPLE = `{
  "inputs": [
    {
      "txid": "5df6e0e2761359d30a8275058e2678ab78211f49fdf87c8ac664586000000000",
      "vout": 0
    }
  ],
  "outputs": [
    {
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "amount": 100000
    }
  ]
}`;

const RESPONSE_EXAMPLE = `{
  "tx_hex": "010000000100000000605864c68a7cf8fd491f2178ab78268e0575820ad3591376e2e0f65d0000000000ffffffff01a0860100000000001976a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac00000000"
}`;

const CARGO_RUN = `cd api
cargo run --release`;

const DOCKER_RUN = `docker build -t btcx_api -f api/Dockerfile api/
docker run -p 8080:8080 btcx_api`;

const FLY_RUN = `fly launch
fly deploy`;

function Endpoint() {
  return (
    <section id="endpoint" className="scroll-mt-24 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
          Endpoint
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-display sm:text-4xl">
          POST /create_tx
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-normal text-muted-foreground sm:text-base">
          JSON in, hex out. Amounts are satoshis — 1 BTC is 100,000,000 sats.
          Invalid txids, invalid addresses, and network mismatches return 400.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CodeCard title="Request body" code={REQUEST_EXAMPLE} />
          <CodeCard title="Response" code={RESPONSE_EXAMPLE} />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Spec term="inputs[].txid" value="64-char hex" />
          <Spec term="inputs[].vout" value="output index" />
          <Spec term="outputs[].address" value="mainnet Bitcoin" />
          <Spec term="outputs[].amount" value="satoshis" />
        </dl>
      </div>
    </section>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <dt className="font-mono text-xs text-subtle">{term}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function CodeCard({ title, code }: { title: string; code: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
          {title}
        </p>
        <CopyButton text={code} />
      </div>
      <pre className="max-h-80 overflow-auto break-all whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-foreground">
        {code}
      </pre>
    </div>
  );
}

function Deploy() {
  return (
    <section id="deploy" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
          Run it
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-display sm:text-4xl">
          Cargo, Docker, or Fly.io
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-normal text-muted-foreground sm:text-base">
          Rust 1.88 or newer. The binary listens on all interfaces at port 8080.
          A live instance is already up if you just need to try the contract.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <CodeCard title="Release binary" code={CARGO_RUN} />
          <CodeCard title="Docker" code={DOCKER_RUN} />
          <CodeCard title="Fly.io" code={FLY_RUN} />
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Hosted API</p>
            <p className="mt-1 break-all font-mono text-sm text-muted-foreground">
              {SITE.hostedApi}/create_tx
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href={SITE.hostedApi} target="_blank" rel="noreferrer noopener">
              Open host
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border pb-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mark className="size-5" />
          <span>BTCX is the public face of btcx_api.</span>
        </div>
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-muted-foreground"
        >
          github.com/yanncarlier/btcx_api
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
