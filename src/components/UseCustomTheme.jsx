import React from 'react';
import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const UseCustomTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          action: {
            hoverEdit: '#262626',  // Green color for edit hover
            hoverDelete: '#FF5252', // Red color for delete hover
          },
          primary: {
            main: "#262626",
          },
          secondary: {
            main: "#eee"
          },
          hoverBlue: {
            main: '#262626'
          },
          hoverRed: {
            main: '#eb4343'
          },
          error: {
            main: "#e53935"
          },
          white: {
            main: '#fff'
          },
          grey: {
            main: "#9e9e9e"
          },
          buy: {
            main: "#00A880C7"
          },
          sell: {
            main: "#EB5B3C"
          },
          gray: {
            main: "#A4A4A4"
          }
        },
        typography: {
          h1: {
            fontSize: 22,
            text: '#2E2E2E',

          },
          h2: {
            fontSize: 22,
            text: '#909090',

          },
          h5: {
            fontSize: 20,
            text: '#909090',

          },
          subtitle1: {
            fontSize: 14,
            color: '#2E2E2E'
          },
          subtitle2: {
            fontSize: 12,
            color: '#909090'
          },
          body1: {
            fontWeight: 500,
          },

        },   
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              input: {
                "&:-webkit-autofill": {
                  "-webkit-box-shadow": "0 0 0 100px var(--primary-weak) inset",
                  "-webkit-text-fill-color": "var(--text-primary)",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
              
              // contained: {
              //   backgroundColor: '#333',
              //   color: '#FFFFFF',
              //   '&:hover': { backgroundColor: '#000' },

              // },
              // outlined: {
              //   borderColor: '#B2B2B2',
              //   color: '#B2B2B2',
              //   '&:hover': {
              //     backgroundColor: '#f0f0f0',
              //     borderColor: '#0036DF',
              //     color: '#0036DF',
              //   },
              // },
              // text: {
              //   color: '#0047FF',
              //   '&:hover': {
              //     backgroundColor: 'rgba(0, 71, 255, 0.1)',
              //   },
              // },
            },
          },
          // MuiIconButton: {
          //   styleOverrides: {
          //     root: {
          //       color: '#bcbcbc',
          //       '&:hover': {
          //         color: '#2864ff',
          //       },
          //     },
          //   },
          // },
        },
      }),
    [prefersDarkMode]
  );

  return theme;
};

export default UseCustomTheme;
