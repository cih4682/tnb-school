import { ReactNode } from "react";

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className = "", children }: Props) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl px-6 py-20 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}
