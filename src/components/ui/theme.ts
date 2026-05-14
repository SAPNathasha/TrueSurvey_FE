import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
    transitionProperty: "common",
    transitionDuration: "fast",
  },

  variants: {
    variant: {
      primary: {
        bg: "brand.primaryBlue",
        color: "white",
        _hover: {
          bg: "brand.subtle",
        },
        _active: {
          bg: "brand.muted",
        },
      },

      secondary: {
        bg: "transparent",
        color: "black",
        borderWidth: "1px",
        borderColor: "brand.solid",
        _hover: {
          bg: "brand.fg",
          color: "black",
        },
      },
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

const formCardRecipe = defineRecipe({
  base: {
    width: "450px",
    height: "600px",
    bg: "white",
    boxShadow: "2px 4px 25px 4px rgba(0, 0, 0, 0.15)",
    borderRadius: "lg",
    p: "6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4",
  },
});

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#000957" },
          100: { value: "#0015D6" },
          200: { value: "#0011AD" },
          300: { value: "#FFEB00" },
          400: { value: "#A0A0A0" },
        },
      },
      fonts: {
        heading: { value: "var(--font-inter), sans-serif" },
        body: { value: "var(--font-inter), sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.100}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.400}" },
          muted: { value: "{colors.brand.50}" },
          subtle: { value: "{colors.brand.200}" },
          focusRing: { value: "{colors.brand.300}" },
        },
      },
    },
    textStyles: {
      h1: {
        value: {
          fontFamily: "heading",
          fontSize: "50px",
          fontWeight: "bold",
          lineHeight: "1.1",
          letterSpacing: "tight",
        },
      },

      h2: {
        value: {
          fontFamily: "heading",
          fontSize: "30px",
          fontWeight: "bold",
          lineHeight: "1.1",
          letterSpacing: "tight",
        },
      },

      text: {
        value: {
          fontFamily: "body",
          fontSize: "12px",
          fontWeight: "regular",
          color: "brand.fg",
          letterSpacing: "tight",
          lineHeight: "1.1",
          textAlign: "center",
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
});
export const system = createSystem(defaultConfig, customConfig);
