import { forwardRef } from "react";
import NextLink from "next/link";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { lighten } from "@mui/system";

import type { PropsWithChildren } from "react";
import type { LinkProps as MuiLinkProps } from "@mui/material/Link";
import type { LinkProps as NextLinkProps } from "next/link";

// Source: https://mui.com/material-ui/guides/routing/#global-theme-link
const LinkBehavior = forwardRef<HTMLAnchorElement, NextLinkProps>(
  (props, ref) => <NextLink ref={ref} {...props} />
);
LinkBehavior.displayName = "LinkBehavior";

let theme = createTheme();

const palette = {
  primary: {
    light: "#E9EBF6",
    main: "#0F143D",
  },
  neutral: {
    main: "#F5F5F5",
    contrastText: "#6A6A6A",
  },
};

theme = createTheme({
  palette,
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      letterSpacing: -2.5,
      [theme.breakpoints.down("md")]: {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 800,
      letterSpacing: -1,
      [theme.breakpoints.down("md")]: {
        fontSize: "1.875rem",
      },
    },
    h3: {
      fontSize: "1.8rem",
      fontWeight: 700,
      letterSpacing: -0.75,
      [theme.breakpoints.down("md")]: {
        fontSize: "1.2rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: -0.5,
      [theme.breakpoints.down("md")]: {
        fontSize: "1.1rem",
      },
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.4,
      [theme.breakpoints.down("md")]: {
        fontSize: "1rem",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
        },
      },
    },
    MuiListItemButton: {
      variants: [
        {
          props: { selected: true },
          style: {
            backgroundColor: `${palette.primary.light} !important`,
            ".MuiListItemIcon-root": {
              color: palette.primary.main,
            },
            ".MuiTypography-root": {
              fontWeight: 700,
              color: palette.primary.main,
            },
          },
        },
      ],
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: "none",
      } as MuiLinkProps,
      variants: [
        {
          props: { color: "primary" },
          style: {
            position: "relative",
            fontWeight: 500,
            // display: "inline-block",
            backgroundImage: `linear-gradient(${lighten(
              theme.palette.primary.main,
              0.8
            )}, ${lighten(theme.palette.primary.main, 0.8)})`,
            backgroundSize: "100% 6px",
            backgroundPosition: "0 100%",
            backgroundRepeat: "no-repeat",
            transition: "background-size 0.3s ease-in-out 0s",
            "&:hover": {
              backgroundSize: "100% 100%",
            },
          },
        },
      ],
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1", gutterBottom: true },
          style: {
            marginBottom: 24,
          },
        },
        {
          props: { variant: "h2", gutterBottom: true },
          style: {
            marginBottom: 16,
          },
        },
        {
          props: { variant: "body1", gutterBottom: true },
          style: {
            marginBottom: 20,
          },
        },
      ],
    },
  },
});

const ThemeProvider = ({ children }: PropsWithChildren) => (
  <MuiThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;
