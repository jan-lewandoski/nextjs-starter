import { AppShell, Box } from "@mantine/core";
import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      styles={() => ({
        main: { padding: 0 },
      })}
    >
      <Box>{children}</Box>
    </AppShell>
  );
}
