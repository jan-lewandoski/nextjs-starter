import { type MantineThemeOverride } from "@mantine/core";

import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "300", "400", "700", "900"],
});

export const theme: MantineThemeOverride = {
  fontFamily: lato.style.fontFamily,
};
