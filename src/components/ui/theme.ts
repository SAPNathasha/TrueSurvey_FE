import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "semibold",
    borderRadius: "10px",
    transitionProperty: "common",
    transitionDuration: "fast",
    height: "44px",
  },

  variants: {
    variant: {
      solid: {
        bg: "brand.primary",
        color: "white",
        borderWidth: "1px",
        borderColor: "brand.primary",

        _hover: {
          bg: "brand.primaryHover",
          borderColor: "brand.primaryHover",
        },

        _active: {
          bg: "brand.navy",
          borderColor: "brand.navy",
        },
      },

      outline: {
        bg: "white",
        color: "brand.primary",
        borderWidth: "1px",
        borderColor: "brand.primary",

        _hover: {
          bg: "brand.lightBlue",
          color: "brand.primaryHover",
          borderColor: "brand.primaryHover",
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
  },
});

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          navy: { value: "#000957" },
          blue: { value: "#0015D6" },
          blueHover: { value: "#0011AD" },
          yellow: { value: "#FFEB00" },
          grayText: { value: "#A0A0A0" },
          lightBlue: { value: "#DDE8FE" },
        },

        gray: {
          subtle: { value: "#F4F4F4" },
          border: { value: "#E5E7EB" },
        },
      },

      fonts: {
        heading: { value: "var(--font-inter), sans-serif" },
        body: { value: "var(--font-inter), sans-serif" },
      },

      shadows: {
        card: { value: "2px 4px 25px 4px rgba(0, 0, 0, 0.15)" },
      },

      radii: {
        card: { value: "12px" },
        input: { value: "10px" },
      },
    },

    semanticTokens: {
      colors: {
        brand: {
          primary: { value: "{colors.brand.blue}" },
          primaryHover: { value: "{colors.brand.blueHover}" },
          dark: { value: "{colors.brand.navy}" },
          accent: { value: "{colors.brand.yellow}" },
          mutedText: { value: "{colors.brand.grayText}" },
          lightBlue: { value: "{colors.brand.lightBlue}" },
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

      bodyText: {
        value: {
          fontFamily: "body",
          fontSize: "14px",
          fontWeight: "normal",
          lineHeight: "1.5",
          color: "brand.mutedText",
        },
      },

      smallText: {
        value: {
          fontFamily: "body",
          fontSize: "12px",
          fontWeight: "normal",
          lineHeight: "1.3",
          color: "brand.mutedText",
        },
      },

      label: {
        value: {
          fontFamily: "body",
          fontSize: "12px",
          fontWeight: "medium",
          color: "black",
        },
      },

      link: {
        value: {
          fontFamily: "body",
          fontSize: "13px",
          fontWeight: "medium",
          color: "brand.primary",
          cursor: "pointer",
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);