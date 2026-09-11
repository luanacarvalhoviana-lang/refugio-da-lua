import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  asChild,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={className} type={asChild ? undefined : type} {...props} />;
}
