import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-xs font-medium tracking-label text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
