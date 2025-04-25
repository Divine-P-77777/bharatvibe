import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { useAppSelector } from "@/store/hooks";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className = "", ...props }, ref) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={`
        text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        ${isDarkMode ? "text-white" : "text-black"}
        ${className}
      `}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
