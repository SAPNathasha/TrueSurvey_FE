import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
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
          bg: "brand.dark",
          borderColor: "brand.dark",
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

      ghost: {
        bg: "transparent",
        color: "brand.primary",

        _hover: {
          bg: "brand.lightBlue",
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
  },
});

const nativeSelectSlotRecipe = defineSlotRecipe({
  slots: ["root", "field", "indicator"],

  base: {
    root: {
      width: "100%",
    },

    field: {
      bg: "white",
      color: "brand.dark",
      borderColor: "brand.border",
      borderRadius: "input",
      fontSize: "sm",
      lineHeight: "normal",
      _hover: {
        borderColor: "gray.border",
      },
      _focusVisible: {
        borderColor: "brand.primary",
        boxShadow: "0 0 0 1px var(--chakra-colors-brand-primary)",
      },
      _focus: {
        boxShadow: "none",
      },
      "& > option, & > optgroup": {
        bg: "white",
        color: "brand.dark",
      },
    },

    indicator: {
      color: "brand.mutedText",
    },
  },

  variants: {
    variant: {
      outline: {
        field: {
          bg: "white",
          borderWidth: "1px",
          borderColor: "brand.border",
        },
      },
    },

    size: {
      sm: {
        root: {
          "--select-field-height": "sizes.10",
        },
        field: {
          h: "10",
          ps: "4",
          pe: "10",
          fontSize: "sm",
        },
        indicator: {
          insetEnd: "3",
        },
      },

      md: {
        root: {
          "--select-field-height": "sizes.11",
        },
        field: {
          h: "11",
          ps: "4",
          pe: "10",
          fontSize: "sm",
        },
        indicator: {
          insetEnd: "3",
        },
      },

      lg: {
        root: {
          "--select-field-height": "sizes.12",
        },
        field: {
          h: "12",
          ps: "4",
          pe: "10",
          fontSize: "md",
        },
        indicator: {
          insetEnd: "3",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

const customConfig = defineConfig({
  globalCss: {
    ".chakra-native-select__field": {
      paddingInlineStart: "1rem !important",
      paddingInlineEnd: "2.5rem !important",
      textIndent: "0",
    },

    ".chakra-native-select__indicator": {
      insetInlineEnd: "0.75rem",
    },

    "select": {
      paddingInlineStart: "1rem !important",
      paddingInlineEnd: "2.5rem !important",
      textIndent: "0",
    },

    "select > option": {
      paddingBlock: "0.5rem",
      paddingInline: "1rem",
    },
  },

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
          cardBorder: { value: "#E5E7EB" },
          cardHover: { value: "#F3F7FF" },
          cardSelected: { value: "#EEF4FF" },
          pageBg: { value: "#F8FAFC" },
          success: { value: "#0AB188" },
          error: { value: "#E53E3E" },
          warning: { value: "#FFB020" },
        },

        gray: {
          subtle: { value: "#F4F4F4" },
          border: { value: "#E5E7EB" },
          inputBg: { value: "#FFFFFF" },
        },
      },

      fonts: {
        heading: { value: "var(--font-inter), sans-serif" },
        body: { value: "var(--font-inter), sans-serif" },
      },

      shadows: {
        card: { value: "2px 4px 25px 4px rgba(0, 0, 0, 0.15)" },
        softCard: { value: "0px 8px 30px rgba(0, 0, 0, 0.08)" },
        roleCard: { value: "0px 4px 16px rgba(0, 0, 0, 0.08)" },
      },

      radii: {
        card: { value: "12px" },
        input: { value: "10px" },
        roleCard: { value: "14px" },
        pill: { value: "999px" },
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

          pageBg: { value: "{colors.brand.pageBg}" },

          border: { value: "{colors.brand.cardBorder}" },
          cardHover: { value: "{colors.brand.cardHover}" },
          cardSelected: { value: "{colors.brand.cardSelected}" },

          success: { value: "{colors.brand.success}" },
          error: { value: "{colors.brand.error}" },
          warning: { value: "{colors.brand.warning}" },
        },
      },
    },
layerStyles: {
    formCard: {
      value: {
        width: "520px",
        minHeight: "600px",
        bg: "white",
        boxShadow: "card",
        borderRadius: "card",
        p: "8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5",
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

      pageTitle: {
        value: {
          fontFamily: "heading",
          fontSize: "36px",
          fontWeight: "bold",
          lineHeight: "1.15",
          letterSpacing: "tight",
          color: "black",
        },
      },

      sectionTitle: {
        value: {
          fontFamily: "heading",
          fontSize: "22px",
          fontWeight: "bold",
          lineHeight: "1.2",
          color: "black",
        },
      },

      roleTitle: {
        value: {
          fontFamily: "heading",
          fontSize: "16px",
          fontWeight: "semibold",
          lineHeight: "1.2",
          color: "black",
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

      helperText: {
        value: {
          fontFamily: "body",
          fontSize: "13px",
          fontWeight: "normal",
          lineHeight: "1.4",
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

      stepText: {
        value: {
          fontFamily: "body",
          fontSize: "13px",
          fontWeight: "semibold",
          color: "brand.primary",
        },
      },

      errorText: {
        value: {
          fontFamily: "body",
          fontSize: "12px",
          fontWeight: "medium",
          color: "brand.error",
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },

    slotRecipes: {
      nativeSelect: nativeSelectSlotRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
