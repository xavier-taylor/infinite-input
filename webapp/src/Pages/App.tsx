import React, { useEffect, useState } from 'react';
import { CssBaseline, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Header from '../Components/Header';
import MenuDrawer from '../Components/Menu/MenuDrawer';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  DueDocument,
  DueQuery,
  NewWordsDocument,
  NewWordsQuery,
  StudyType,
} from '../schema/generated';
import { ReactiveVar, useQuery, useReactiveVar } from '@apollo/client';
import {
  docsToListenVar,
  docsToReadVar,
  DocumentIdList,
  haveFetchedListeningDueVar,
  haveFetchedNewWordsToLearnVar,
  haveFetchedReadingDueVar,
  newWordsToLearnVar,
  WordHanziList,
  wordsToListenVar,
  wordsToReadVar,
} from '../cache';
import { SentencesContainer } from './Sentences/SentencesContainer';
import { NewWordsContainer } from './NewWords/NewWordsContainer';
import { DateTime } from 'luxon';
import { RecordVoiceOver } from '@mui/icons-material';
import Home from './Home';
import Browse from './Browse/Browse';

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
  console.log('setDue was called!');
  haveFetchedDueVar(true);
  docsToStudyVar(data.due.documents.map((d) => d.id));
  wordsToStudyVar(data.due.orphans.map((w) => w.hanzi));
}

export function setNewWords(data: NewWordsQuery) {
  newWordsToLearnVar(data.newWords.words.map((w) => w.hanzi));
  haveFetchedNewWordsToLearnVar(true);
}

const App: React.FC = () => {
  const classes = useStyles();
  // TODO media query whether drawer starts open?
  // TODO put this in a global context or even in apollo rather than passing it around?
  const [drawerOpen, setDrawer] = useState(true);
  const drawer = { drawerOpen, setDrawer };

  // Fetch new words
  const haveFetchedNewWordsToLearn = useReactiveVar(
    haveFetchedNewWordsToLearnVar
  );
  const newWordsRV = useQuery(NewWordsDocument, {
    variables: { dayStartUTC: DateTime.now().startOf('day').toUTC().toISO() },
    skip: haveFetchedNewWordsToLearn,
  });
  useEffect(() => {
    console.log('in useEffect for new words');
    if (newWordsRV.data && !haveFetchedNewWordsToLearn) {
      console.log('will call setDue for new words');
      setNewWords(newWordsRV.data);
    }
  }, [newWordsRV.data, haveFetchedNewWordsToLearn]);

  // TODO error handling for these two queries
  // Fetch due reading
  const haveFetchedReading = useReactiveVar(haveFetchedReadingDueVar);
  const readingRV = useQuery(DueDocument, {
    variables: { studyType: StudyType.Read },
    skip: haveFetchedReading,
  });

  // Putting this inside useEffect to silence this error:
  /*
Warning: Cannot update a component (`StudyContainer`) while rendering a different component (`App`). To locate the bad setState() call inside `App`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
    at App (http://localhost:3000/static/js/main.chunk.js:1991:19)
    at ApolloProvider (http://localhost:3000/static/js/vendors~main.chunk.js:6339:19)
  */
  useEffect(() => {
    console.log('in useEffect for reading');
    if (readingRV.data && !haveFetchedReading) {
      console.log('will call setDue for reading');
      setDue(
        haveFetchedReadingDueVar,
        docsToReadVar,
        wordsToReadVar,
        readingRV.data
      );
    }
  }, [readingRV.data, haveFetchedReading]);
  // Fetch due listening
  const haveFetchedListening = useReactiveVar(haveFetchedListeningDueVar);
  const listeningRV = useQuery(DueDocument, {
    variables: { studyType: StudyType.Listen },
    skip: haveFetchedListening || !haveFetchedReading,
  });
  useEffect(() => {
    console.log('in useEffect for listening');
    if (listeningRV.data && !haveFetchedListening) {
      console.log('will call setDue for listening');
      setDue(
        haveFetchedListeningDueVar,
        docsToListenVar,
        wordsToListenVar,
        listeningRV.data
      );
    }
  }, [listeningRV.data, haveFetchedListening]);
  return (
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
              <Home></Home>
            </Route>
            <Route path="/word/new">
              <NewWordsContainer />
            </Route>
            <Route path="/read/sentence">
              <SentencesContainer mode={StudyType.Read} />
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
              <Browse />
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
  );
};

export default App;
// TODO import roboto and set up typography scale https://material-ui.com/components/typography/
