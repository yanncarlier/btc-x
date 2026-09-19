import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onCopy}
      disabled={!text}
      className={cn("min-w-20", className)}
    >
      <span className="relative size-4">
        <Copy
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200 ease-out",
            copied ? "icon-swap-off" : "icon-swap-on",
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200 ease-out",
            copied ? "icon-swap-on" : "icon-swap-off",
          )}
        />
      </span>
      {copied ? "Copied" : label}
    </Button>
  );
}
