import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
      a: {
        color: "inherit",
      },
      "ins.adsbygoogle[data-ad-status='unfilled']": {
        display: "none",
      },
    },
  },
  colors: {
    brand: {
      50: "#e6f0ff",
      100: "#b8d3ff",
      200: "#8ab6ff",
      300: "#5c99ff",
      400: "#2e7cff",
      500: "#1462e6",
      600: "#0f4cb3",
      700: "#0a3680",
      800: "#05204d",
      900: "#010a1a",
    },
  },
});

export default theme;
