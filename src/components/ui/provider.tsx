"use client";
import { ThemeProvider } from "next-themes";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class">{props.children}</ThemeProvider>
    </ChakraProvider>
  );
}
