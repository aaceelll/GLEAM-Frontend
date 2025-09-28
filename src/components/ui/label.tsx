"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface AppLabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Tampilkan tanda wajib (*) merah di sisi kanan teks label */
  requiredMark?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  AppLabelProps
>(({ className, children, requiredMark, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {requiredMark && (
        <span aria-hidden="true" className="text-red-500">*</span>
      )}
    </LabelPrimitive.Root>
  );
});
Label.displayName = "Label";

export { Label };
