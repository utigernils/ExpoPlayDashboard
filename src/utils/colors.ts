/**
 * SUVA Design System Color Utilities
 *
 * This file provides utilities and constants for consistent color usage
 * across the application according to SUVA Design System guidelines.
 */

export const suvaColors = {
  grey: {
    100: "#666666",
    75: "#8C8C8C",
    50: "#B2B2B2",
    25: "#D9D9D9",
    bg: "#F2F2F2",
  },

  orange: {
    100: "#FF8200",
    75: "#FFA140",
    50: "#FFC07F",
    25: "#FFE0BF",
  },

  blue: {
    100: "#00B8CF",
    75: "#40CADB",
    50: "#7FDBE7",
    25: "#BFEDF3",
  },

  secondary: {
    green: "#C1E200",
    red: "#EB0064",
    yellow: "#FCE300",
    interactionBlue: "#007180",
  },

  system: {
    positive: "#66B300",
    negative: "#CC0000",
    neutral: "#FFCC00",
    information: "#0066CC",
  },

  white: "#FFFFFF",
  black: "#000000",
} as const;

export const semanticColors = {
  text: {
    primary: suvaColors.grey[100],
    secondary: suvaColors.grey[75],
    muted: suvaColors.grey[50],
    heading: suvaColors.orange[100],
  },

  background: {
    primary: suvaColors.white,
    secondary: suvaColors.grey.bg,
    muted: suvaColors.grey[25],
  },

  interactive: {
    primary: suvaColors.blue[100],
    primaryHover: suvaColors.secondary.interactionBlue,
    secondary: suvaColors.orange[100],
    accent: suvaColors.blue[75],
  },

  status: {
    success: suvaColors.system.positive,
    warning: suvaColors.system.neutral,
    error: suvaColors.system.negative,
    info: suvaColors.system.information,
  },

  border: {
    light: suvaColors.grey[25],
    medium: suvaColors.grey[50],
    dark: suvaColors.grey[75],
  },
} as const;

export const cssVariables = `
:root {
  /* Primary Colors - Grey */
  --suva-grey-100: ${suvaColors.grey[100]};
  --suva-grey-75: ${suvaColors.grey[75]};
  --suva-grey-50: ${suvaColors.grey[50]};
  --suva-grey-25: ${suvaColors.grey[25]};
  --suva-bg-grey: ${suvaColors.grey.bg};
  
  /* Primary Colors - Orange */
  --suva-orange-100: ${suvaColors.orange[100]};
  --suva-orange-75: ${suvaColors.orange[75]};
  --suva-orange-50: ${suvaColors.orange[50]};
  --suva-orange-25: ${suvaColors.orange[25]};
  
  /* Primary Colors - Blue */
  --suva-blue-100: ${suvaColors.blue[100]};
  --suva-blue-75: ${suvaColors.blue[75]};
  --suva-blue-50: ${suvaColors.blue[50]};
  --suva-blue-25: ${suvaColors.blue[25]};
  
  /* Secondary Colors */
  --suva-green-accent: ${suvaColors.secondary.green};
  --suva-red-accent: ${suvaColors.secondary.red};
  --suva-yellow-accent: ${suvaColors.secondary.yellow};
  --suva-interaction-blue: ${suvaColors.secondary.interactionBlue};
  
  /* System Colors */
  --suva-positive: ${suvaColors.system.positive};
  --suva-negative: ${suvaColors.system.negative};
  --suva-neutral: ${suvaColors.system.neutral};
  --suva-information: ${suvaColors.system.information};
  
  /* Semantic Colors */
  --color-text-primary: ${semanticColors.text.primary};
  --color-text-secondary: ${semanticColors.text.secondary};
  --color-text-muted: ${semanticColors.text.muted};
  --color-text-heading: ${semanticColors.text.heading};
  
  --color-bg-primary: ${semanticColors.background.primary};
  --color-bg-secondary: ${semanticColors.background.secondary};
  --color-bg-muted: ${semanticColors.background.muted};
  
  --color-interactive-primary: ${semanticColors.interactive.primary};
  --color-interactive-primary-hover: ${semanticColors.interactive.primaryHover};
  --color-interactive-secondary: ${semanticColors.interactive.secondary};
  
  --color-border-light: ${semanticColors.border.light};
  --color-border-medium: ${semanticColors.border.medium};
  --color-border-dark: ${semanticColors.border.dark};
}
`;

export const getStatusColor = (
  status: "success" | "warning" | "error" | "info",
) => {
  return semanticColors.status[status];
};

export const getTextColor = (
  variant: "primary" | "secondary" | "muted" | "heading",
) => {
  return semanticColors.text[variant];
};

export const getBackgroundColor = (
  variant: "primary" | "secondary" | "muted",
) => {
  return semanticColors.background[variant];
};

export const getInteractiveColor = (
  variant: "primary" | "primaryHover" | "secondary" | "accent",
) => {
  return semanticColors.interactive[variant];
};
