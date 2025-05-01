import { cn } from "./utils" // your Tailwind class merge function

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

  const variantClasses = {
    default: "bg-orange-400 text-white hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400",
    destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
    outline:
      "border border-orange-400 bg-white text-orange-500 hover:bg-orange-50 dark:border-orange-500 dark:bg-transparent dark:text-orange-400 dark:hover:bg-orange-950",
    secondary:
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800 border border-orange-400",
    ghost:
      "bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 dark:from-orange-900 dark:to-orange-700",
    link:
      "bg-gradient-to-r from-amber-500 to-rose-500 text-white underline-offset-4 hover:underline dark:from-orange-900 dark:to-orange-700",
  };
  
const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

type ButtonVariant = keyof typeof variantClasses;
type ButtonSize = keyof typeof sizeClasses;

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function cnButtonVariants({
  variant = "default",
  size = "default",
  className = "",
}: ButtonVariantOptions): string {
  return cn(
    baseButtonClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}
