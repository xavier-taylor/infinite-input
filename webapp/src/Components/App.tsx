import React, { useState } from 'react';
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import MenuDrawer from './MenuDrawer';
import Study from './Study';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

const baseTheme = createMuiTheme({
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
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar, // TODO review whether this is doing anything for us
}));

export interface DrawerState {
  drawerOpen: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC = () => {
  const classes = useStyles();
  // TODO media query whether drawer starts open?
  const [drawerOpen, setDrawer] = useState(true);
  const drawer = { drawerOpen, setDrawer };
  const [pageIndex, setPage] = useState(1);
  const page = { pageIndex, setPage };
  return (
    <ThemeProvider theme={baseTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <Header drawer={drawer}></Header>
        <MenuDrawer drawer={drawer} page={page}></MenuDrawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Study drawerOpen={drawerOpen}></Study>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
// TODO import roboto and set up typography scale https://material-ui.com/components/typography/
