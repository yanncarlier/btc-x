import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-foreground", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3.2 27.4 9.8v12.4L16 28.8 4.6 22.2V9.8L16 3.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 11.1 22.2 14.7v7.2L16 25.4l-6.2-3.5v-7.2L16 11.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
