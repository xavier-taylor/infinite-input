import React, { useState } from 'react';
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../Components/Header';
import MenuDrawer from '../Components/MenuDrawer';
import StudyContainer from './Study/StudyContainer';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StudyType } from '../schema/generated';

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
  appBarSpacer: theme.mixins.toolbar,
}));

export interface DrawerState {
  drawerOpen: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC = () => {
  const classes = useStyles();
  // TODO media query whether drawer starts open?
  const [drawerOpen, setDrawer] = useState(true);
  // TODO put this in a global context or even in apollo rather than passing it around?
  const drawer = { drawerOpen, setDrawer };
  return (
    <ThemeProvider theme={baseTheme}>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <Header drawer={drawer}></Header>
          <MenuDrawer drawer={drawer}></MenuDrawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {/* TODO OPTIMIZATION make the back menu in browser meanfinful */}
            <Switch>
              <Route path="/read">
                <StudyContainer
                  mode={StudyType.Read}
                  drawerOpen={drawerOpen}
                ></StudyContainer>
              </Route>
              <Route path="/listen">
                <div>Listen page goes here</div>
              </Route>
              <Route path="/browse">
                <div>
                  I don't recall exactly what browse page was meant to be
                </div>
              </Route>
              <Route path="/settings/appearance">
                <div>Appearance settings</div>
              </Route>
              <Route path="/settings/keyboard">
                <div>keyboard shortcuts etc?</div>
              </Route>
              <Route path="/settings/study">
                <div>study settings</div>
              </Route>
              <Route path="/user">
                <div>user profile</div>
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
// TODO import roboto and set up typography scale https://material-ui.com/components/typography/
