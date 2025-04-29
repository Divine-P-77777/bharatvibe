import { cn } from "./utils" // your Tailwind class merge function

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variantClasses = {
  default: "bg-primary text-white hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-800",
  secondary: "bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
  ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
  link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
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
