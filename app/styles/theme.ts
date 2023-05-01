import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
  },
});

export default theme;