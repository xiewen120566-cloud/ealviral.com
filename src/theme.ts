import { defineStyle, extendTheme, type ThemeConfig } from "@chakra-ui/react";


const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export default extendTheme({
  config,
  colors: {
    cyan: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },
  },
  semanticTokens: {
    colors: {
      blue: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
      },
      bg: {
        default: "#f8fafc",
        _dark: "#f8fafc",
      },
      "surface.1": {
        default: "#ffffff",
        _dark: "#ffffff",
      },
      "surface.2": {
        default: "#f1f5f9",
        _dark: "#f1f5f9",
      },
      "border.subtle": {
        default: "rgba(15,23,42,0.12)",
        _dark: "rgba(15,23,42,0.12)",
      },
      "text.primary": {
        default: "#0f172a",
        _dark: "#0f172a",
      },
      "text.muted": {
        default: "#475569",
        _dark: "#475569",
      },
      "drawer.dialog.bg": {
        default: "white",
        _dark: "white",
      }
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "cyan",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "surface.1",
            borderColor: "border.subtle",
            _hover: {
              borderColor: "rgba(14,165,233,0.55)",
            },
            _focusVisible: {
              borderColor: "cyan.400",
              boxShadow: "0 0 0 3px rgba(34,211,238,0.25)",
            },
          },
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "surface.1",
          border: "1px solid",
          borderColor: "border.subtle",
          color: "text.primary",
          overflow: "hidden",
        },
        item: {
          _focus: { bg: "surface.2" },
          _hover: { bg: "surface.2" },
        },
      },
    },
  },
  styles: {
    global: defineStyle({
      "html, body": {
        minHeight: "100%",
        bg: "bg.default",
        color: "text.primary",
      },
      body: {
        bg: "bg.default",
        color: "text.primary",
        overflowX: "hidden",
        backgroundImage:
          "radial-gradient(900px circle at 12% 8%, rgba(14,165,233,0.14), rgba(14,165,233,0) 55%), radial-gradient(800px circle at 88% 18%, rgba(34,197,94,0.12), rgba(34,197,94,0) 60%)",
        backgroundAttachment: "fixed",
        paddingBottom: "70px",
        "@media (min-width: 768px)": {
          paddingBottom: 0,
        },
      },
      "#__next": {
        bg: "bg.default",
      },
      ".star": {
        "&.full" : {
          background: "url(/static/images/star/star.png) no-repeat",
          backgroundSize: "auto 100%"
        },
        "&.empty" : {
          background: "url(/static/images/star/empty-star.png) no-repeat",
          backgroundSize: "auto 100%"
        },
        "&.half" : {
          background: "url('/static/images/star/half-star.png') no-repeat, url('/static/images/star/empty-star.png') no-repeat",
          backgroundSize: "auto 100%, auto 100%"
        }
      },
      "ins.adsbygoogle[data-ad-status='unfilled']:not(#goplaygame-Home-Banner):not(#gameworkspace-Home-Banner)": {
        display: "none"
      },
      "#description a" : {
        color: "cyan.500"
      },
      "a": {
        color: "inherit"
      },
      ".gpt-sticky-bottom": {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        "@media (min-width: 768px)": {
          display: "none"
        }
      },
      ".gpt-sticky-bottom__inner": {
        pointerEvents: "auto",
        width: "100%",
        maxWidth: "320px",
        minHeight: "50px",
        display: "flex",
        justifyContent: "center",
      }
    }),
  },
});
