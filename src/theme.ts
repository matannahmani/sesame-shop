import { PaletteMode, ThemeOptions } from "@mui/material";
import { orange, black, grey } from "../styles/colors";

const lightThemeOptions: ThemeOptions = {
  // @ts-ignore
  palette: {
    background: {
      default: "#FFFFFF",
      paper: "#F9F9F9",
    },
    text: {
      primary: black.darkest_black,
      secondary: grey.darkest_grey,
      disabled: grey.middle_grey,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: orange.keyring_orange,
          color: orange.keyring_orange,
          ":hover": {
            shadow: orange.keyring_orange,
            borderColor: orange.keyring_orange,
          },
        },
        contained: {
          backgroundColor: orange.keyring_orange,
          ":hover": {
            backgroundColor: orange.keyring_orange,
          },
        },
      },
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  // @ts-ignore
  palette: {
    background: {
      default: "#010101",
      paper: "#F9F9F9",
    },
    text: {
      primary: "#FFFFFF",
      secondary: grey.lightest_grey,
      disabled: grey.middle_grey,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: orange.keyring_orange,
          color: orange.keyring_orange,
          ":hover": {
            borderColor: orange.keyring_orange,
          },
        },
        contained: {
          backgroundColor: orange.keyring_orange,
          ":hover": {
            backgroundColor: orange.keyring_orange,
          },
        },
      },
    },
  },
};

export const getThemeOptions = (darkMode: boolean): ThemeOptions => {
  if (darkMode) return darkThemeOptions;
  return lightThemeOptions;
};

export const getStoredTheme = (): PaletteMode | null => {
  return localStorage.getItem("user-theme") as PaletteMode | null;
};

export const setStoredTheme = (mode: PaletteMode): void => {
  localStorage.setItem("user-theme", mode);
};
