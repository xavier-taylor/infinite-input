import React, { useState } from 'react';
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../Components/Header';
import MenuDrawer from '../Components/MenuDrawer';
import Study from './Study/Study';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DueDocument, DueQuery, StudyType } from '../schema/generated';
import {
  QueryResult,
  ReactiveVar,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import {
  docsToListenVar,
  docsToReadVar,
  DocumentIdList,
  haveFetchedListeningDueVar,
  haveFetchedReadingDueVar,
  WordHanziList,
  wordsToListenVar,
  wordsToReadVar,
} from '../cache';
import { StudyContainer } from './Study/StudyContainer';

const baseTheme = createTheme({
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

function setDue(
  haveFetchedDueVar: ReactiveVar<boolean>,
  docsToStudyVar: ReactiveVar<DocumentIdList>,
  wordsToStudyVar: ReactiveVar<WordHanziList>,
  data: DueQuery
) {
  haveFetchedDueVar(true);
  docsToStudyVar(data.due.documents.map((d) => d.id));
  wordsToStudyVar(data.due.orphans.map((w) => w.hanzi));
}

const App: React.FC = () => {
  const classes = useStyles();
  // TODO media query whether drawer starts open?
  // TODO put this in a global context or even in apollo rather than passing it around?
  const [drawerOpen, setDrawer] = useState(true);
  const drawer = { drawerOpen, setDrawer };

  // Fetch new words TODO

  // TODO error handling for these two queries
  // Fetch due reading
  const haveFetchedReading = useReactiveVar(haveFetchedReadingDueVar);
  const readingRV = useQuery(DueDocument, {
    variables: { studyType: StudyType.Read },
    skip: haveFetchedReading,
  });
  if (readingRV.data && !haveFetchedReading) {
    setDue(
      haveFetchedReadingDueVar,
      docsToReadVar,
      wordsToReadVar,
      readingRV.data
    );
  }
  // Fetch due listening
  const haveFetchedListening = useReactiveVar(haveFetchedListeningDueVar);
  const listeningRV = useQuery(DueDocument, {
    variables: { studyType: StudyType.Listen },
    skip: haveFetchedListening || !haveFetchedReading,
  });
  if (listeningRV.data && !haveFetchedListening) {
    setDue(
      haveFetchedListeningDueVar,
      docsToListenVar,
      wordsToListenVar,
      listeningRV.data
    );
  }

  return (
    <ThemeProvider theme={baseTheme}>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <Header drawer={drawer} />
          <MenuDrawer
            drawer={drawer}
            loadingReading={!haveFetchedReading || readingRV.loading}
            loadingListening={!haveFetchedListening || listeningRV.loading}
          />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route exact path="/">
                <div>some kind of home page</div>
              </Route>
              <Route path="/word/new">
                <div>learn new words</div>
              </Route>
              <Route path="/read/sentence">
                <StudyContainer mode={StudyType.Read} drawerOpen={drawerOpen} />
              </Route>
              <Route path="/read/word">
                <div>read orphan words</div>
              </Route>
              <Route path="/listen/sentence">
                <div>Listen document page goes here</div>
              </Route>
              <Route path="/listen/word">
                <div>listen orphan words</div>
              </Route>
              <Route path="/browse">
                <div>browse and control words (ie whether locked )</div>
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
