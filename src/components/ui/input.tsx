import * as React from "react";
import { useAppSelector } from "@/store/hooks";

interface InputProps extends React.ComponentProps<"input"> {
  isDarkMode?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
      <input
        type={type}
        ref={ref}
        className={`
          w-full h-11 px-4 py-2 text-base md:text-sm rounded-3xl border shadow-sm font-sans
          placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          file:border-0 file:bg-transparent file:text-sm file:font-medium
          disabled:cursor-not-allowed disabled:opacity-50
          ${
            isDarkMode
              ? "bg-gradient-to-br from-black to-gray-800 text-white border-gray-700 focus-visible:ring-orange-400"
              : "bg-gradient-to-br from-orange-100 to-rose-100 text-black border-orange-300 focus-visible:ring-orange-500"
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
