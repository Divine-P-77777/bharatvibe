import * as React from "react";
import { useAppSelector } from "@/store/hooks";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
      <textarea
        ref={ref}
        className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${
            isDarkMode
              ? "bg-gradient-to-br from-black to-blue-900 border-blue-800 focus-visible:ring-blue-600"
              : "bg-gradient-to-br from-orange-100 to-red-200 border-orange-300 focus-visible:ring-orange-500"
          }
          ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
