"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SelectNative({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("h-11 w-full rounded-xl border bg-white/80 px-3 text-sm outline-none focus:ring-2 focus:ring-ring", className)}
      {...props}
    />
  );
}
