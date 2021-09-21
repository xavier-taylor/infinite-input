import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCacheConfig,
} from '@apollo/client';
import { cache } from './cache';
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  adaptV4Theme,
} from '@mui/material';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  connectToDevTools: true, // process.env.NODE_ENV === ‘development’
});

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// TODO UPGRADE update this theme - it currently isnt even working - the font aint getting applied
const baseTheme = createTheme(
  adaptV4Theme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          ':lang(zh)': {
            // any component with lang='zh' will get this font
            fontFamily: "'Noto Serif SC', serif",
          },
        },
      },
    },
  })
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={baseTheme}>
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
