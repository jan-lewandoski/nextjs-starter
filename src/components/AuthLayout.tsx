import { Lato } from "next/font/google";
import { type ReactNode } from "react";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "300", "400", "700", "900"],
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main style={lato.style}>
      <div>{children}</div>
    </main>
  );
}
