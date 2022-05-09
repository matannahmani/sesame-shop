import { PaletteMode } from '@mui/material';

import {
  fourthLight,
  mainLight,
  secondaryLight,
  thirdLight,
  mainDark,
  secondaryDark,
  thirdDark,
  fourthDark,
} from './colors';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    // primary: '#FF631B',
    mode,
    primary: {
      main: '#FF631B',
    },
    ...(mode === 'light'
      ? {
          // palette values for light mode
          // divider: deepOrange[700],
          main: mainLight,
          secondary: secondaryLight,
          third: thirdLight,
          fourth: fourthLight,
          shadow: '#010101',
          background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#010101',
            secondary: '#161616',
          },
        }
      : {
          // palette values for dark mode
          // divider: deepOrange[700]
          main: mainDark,
          secondary: secondaryDark,
          third: thirdDark,
          fourth: fourthDark,
          shadow: '#FFFFFF',
          background: {
            default: '#010101',
            paper: '#010101',
          },
          text: {
            primary: '#fff',
            secondary: '#FBFBFB',
          },
        }),
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    shadow: string;
    third: string;
    main: string;
  }
  interface PaletteOptions {
    shadow: string;
    third: string;
    main: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    shadow: true;
    third: true;
  }
}

// declare module '@mui/material/styles' {
//   interface Theme {
//     shadow: {
//       main: string;
//     };
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     shadow?: {
//       main?: string;
//     };
//   }
// }

// declare module '@material-ui/core/styles/createPalette' {
//   interface Palette {
//     third: string[];
//     fourth: string[];
//   }

//   interface PaletteOptions {
//     third: string[];
//     fourth: string[];
//   }
// }
export { getDesignTokens };
