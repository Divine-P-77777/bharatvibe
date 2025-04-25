import * as React from "react";
import { useAppSelector } from "@/store/hooks";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = "", type = "text", ...props }, ref) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
      <input
        type={type}
        ref={ref}
        className={`
          flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
          ${
            isDarkMode
              ? "bg-gradient-to-br from-black to-blue-900 border-blue-800 text-white focus-visible:ring-blue-600"
              : "bg-gradient-to-br from-orange-100 to-red-200 border-orange-300 text-black focus-visible:ring-orange-500"
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
