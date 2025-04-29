import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cnButtonVariants } from "@/lib/classnames";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cnButtonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
