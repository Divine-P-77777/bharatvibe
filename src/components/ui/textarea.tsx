import * as React from "react";
import { useAppSelector } from "@/store/hooks";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
      <textarea
        ref={ref}
        className={`
          w-full min-h-[100px] px-4 py-2 text-base md:text-sm rounded-3xl border shadow-sm font-sans resize-none
          placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${
            isDarkMode
              ? "bg-gradient-to-br from-black to-gray-800 text-white border-gray-700 focus-visible:ring-orange-400"
              : "bg-gradient-to-br from-orange-100 to-rose-100 text-white border-orange-300 focus-visible:ring-orange-500"
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
