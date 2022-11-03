import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function ThemeWrapper(props) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#5465FF'
      },
      secondary: {
        main: "#FFFFFF"
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}

export default ThemeWrapper;
