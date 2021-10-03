import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { cache } from './cache';
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  connectToDevTools: true, // process.env.NODE_ENV === ‘development’
});

// This came from the mui v4-v5 code, not sure what it does
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: ``,
    },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
