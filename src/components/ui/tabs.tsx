import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useAppSelector } from "@/store/hooks";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className = "", ...props }, ref) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={`flex-col h-fit flex px-7 sm:px-2 sm:inline-flex sm:h-10 border border-orange-500 items-center justify-center  rounded-3xl p-1 text-white ${
        isDarkMode
          ? "bg-gradient-to-r from-black to-gray-900"
          : "bg-gradient-to-r from-amber-400 to-rose-500"
      } ${className} sm:flex-row flex-col items-center `}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className = "", ...props }, ref) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`inline-flex-col flex sm:inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-medium transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm ${
        isDarkMode
          ? "focus-visible:ring-amber-600"
          : "focus-visible:ring-orange-400"
      } ${className}`}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className = "", ...props }, ref) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDarkMode
          ? "focus-visible:ring-amber-600"
          : "focus-visible:ring-orange-400"
      } ${className}`}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
