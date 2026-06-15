"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import { theme } from "@/styles/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledComponentsRegistry>
  );
}
