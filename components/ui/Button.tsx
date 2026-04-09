import Link from "next/link";
import { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/30",
  secondary:
    "bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20",
};

interface Props extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  className?: string;
}

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition ${styles[variant]} ${className}`}
    />
  );
}
