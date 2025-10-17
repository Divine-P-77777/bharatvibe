import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import clsx from "clsx";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <div
      ref={ref}
      className={clsx(
        `rounded-3xl shadow-md border text-base font-sans transition-all duration-300
         w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto
         flex flex-col items-center justify-center
         p-4 sm:p-6`,
        isDarkMode
          ? "bg-gradient-to-br from-black to-gray-800 text-white border-gray-700 font-inter"
          : "bg-gradient-to-br from-orange-100 to-rose-100 text-black border-orange-300 font-poppins",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      `flex flex-col space-y-2 w-full text-center p-4 sm:p-6`,
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx(
      `text-lg sm:text-2xl md:text-3xl font-bold tracking-wide leading-snug`,
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={clsx(
      `text-sm sm:text-base opacity-80 leading-relaxed px-2 sm:px-4`,
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(`p-4 sm:p-6 pt-0 w-full text-center`, className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref} 
    className={clsx(
      `flex flex-col sm:flex-row gap-3 items-center justify-center w-full p-4 sm:p-6 pt-0 
       border-t border-gray-300 dark:border-gray-700`,
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
