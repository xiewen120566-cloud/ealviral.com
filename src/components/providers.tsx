"use client";

import { PropsWithChildren } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

import theme from "@/theme";

const forcedColorMode = (theme.config?.initialColorMode ?? "light") as "light" | "dark";
const forcedColorModeManager = {
  type: "localStorage",
  get: () => forcedColorMode,
  set: () => {},
} as const;

export function Providers({ children }: PropsWithChildren) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} colorModeManager={forcedColorModeManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
