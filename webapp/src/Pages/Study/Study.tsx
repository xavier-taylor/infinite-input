import React, { useState } from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import clsx from 'clsx';
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import {
  Button,
  ButtonGroup,
  Grid,
  Typography,
  Card,
  useMediaQuery,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
} from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';
import Concordance from '../../Components/Concordance';
import {
  Document,
  DocumentByIdDocument,
  DocumentStudyDocument,
  DocumentStudyMutationVariables,
  ForgotSentenceWordDocument,
  ForgotSentenceWordQueryVariables,
  ForgottenWordsDocument,
  SentenceWord,
  StudyType,
} from '../../schema/generated';
import { gql, useMutation, useQuery } from '@apollo/client';
import { cache } from '../../cache';
import { client } from '../..';
import { GridContainer, GridRow, RowCard } from '../../Components/Layout/Grid';

// TODO https://material-ui.com/guides/minimizing-bundle-size/ do that stuff

// TODO break this study component out into multiple components, and take the appropriate part of this
// mamoth makeStyles with them. In particuarl, for things like 'cardHeaderRoot', ideally that should be a 'root' within a CreateStyles
// TODO tidy up the CSS - it got pretty disorderly - even the layout of the first two rows is needlessly messy and complicated
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroupGrouped: {
      // fontFamily: "'Roboto Mono', monospace",
      width: '50%', // works for 2 buttons with similar length labels
    },
    cardActionRoot: {
      justifyContent: 'center',
    },
    cardHeaderRoot: {
      padding: theme.spacing(1),
      paddingBottom: '0px',
    },
    '@keyframes example': {
      '0%': { backgroundColor: theme.palette.background.default },
      // from: { backgroundColor: 'yellow' },
      '50%': { backgroundColor: theme.palette.info.light },
      '100%': { backgroundColor: theme.palette.background.default },
    },
    recentCard: {
      // background: theme.palette.grey[300], // TODO make this effect only happen if there is more than one definition card rendered
      // https://github.com/mui-org/material-ui/issues/13793
      animationName: '$example',
      animationDuration: '2s',
    },
    cardHeaderAction: {
      padding: theme.spacing(0.5),
    },
    cardContentRoot: {
      padding: theme.spacing(1),
      // TODO making this paddingBottom work, currently it is getting overwritten by some pseudo class or something
      paddingBottom: '0px',
      paddingTop: '0px',
      '&:last-child': {
        paddingBottom: '0px',
      },
    },
    sentenceHanzi: {
      fontSize: '1.5rem',
    },

    rowCard: {
      borderRadius: 15,
      padding: theme.spacing(1),
    },
    definition: {
      overflowY: 'auto',
      borderRadius: 7.5,
      height: '100%',
    },
    definitionContainer: {
      height: `calc(100% - ${theme.spacing(1)}px)`,
      margin: theme.spacing(0.5),
      '&:nth-child(1)': {
        marginLeft: '0px',
      },
      '&:last-child': {
        marginRight: '0px',
      },
    },
  })
);

interface StudyProps {
  mode: StudyType;
  documentId: Document['id'];
  isLast: boolean;
  next: () => void; // a function that tells parent we are ready for next document
}
// TODO strip newlines from sentences in database! - ie update ingestion script?

const Study: React.FC<StudyProps> = ({ mode, documentId, isLast, next }) => {
  // TODO since we are meant to only be grabbing documents
  // that we already have in the cache, rather than using useQuery, we could
  // use client.readQuery
  const { data, loading, error } = useQuery(DocumentByIdDocument, {
    variables: { id: documentId },
  });

  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  let numberToShow = xs ? 1 : sm ? 2 : md ? 3 : lg ? 4 : 6; // if it wasn't large, it was xl
  type studyStates = 'study' | 'check';
  const [studyState, setStudyState] = useState<studyStates>('study'); // whether you are reading/listening, or looking at translation etc
  const [concordanceWord, setConcordanceWord] = useState<string | undefined>(
    undefined
  );
  const [recentWord, setRecentWord] = useState<
    Partial<Pick<SentenceWord, 'sentenceId' | 'stanzaId'>>
  >({});

  const [
    studyDocument,
    { data: _data, loading: _loading, error: _error },
  ] = useMutation(DocumentStudyDocument);

  const rightButtonText: Record<studyStates, string> = {
    study: 'Show',
    check: 'Next',
  };
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  // TODO
  if (loading) return <div></div>;
  else if (error) return <div>error</div>;
  else if (!data) return <div>no data?</div>;

  const { document } = data;

  const words: SentenceWord[] = [];
  for (let s of document.sentences) {
    words.push(...s.words);
  }
  words.sort((b, a) => {
    const bSIndex = parseInt(b.sentenceId);
    const aSIndex = parseInt(a.sentenceId);
    if (aSIndex === bSIndex) {
      return b.stanzaId - a.stanzaId;
    } else {
      return bSIndex - aSIndex;
    }
  });
  // OPTIMIZATION: since I am not really using the grid, perhaps remove it and just have a simple flexbox?
  const forgot = (mode: StudyType, word: SentenceWord) =>
    !!(mode === StudyType.Read && word.forgotREAD) ||
    !!(mode === StudyType.Listen && word.forgotLISTEN);

  // TODO optimize this or at least make it less wasteful.
  const wordsToShow =
    studyState === 'check'
      ? words
          .filter((w) => w.universalPartOfSpeech !== 'PUNCT')
          .sort((a, b) => b.lastClicked - a.lastClicked)
          .slice(0, numberToShow)
          .sort((b, a) => {
            const bSIndex = parseInt(b.sentenceId);
            const aSIndex = parseInt(a.sentenceId);
            if (aSIndex === bSIndex) {
              return b.stanzaId - a.stanzaId;
            } else {
              return bSIndex - aSIndex;
            }
          })
      : words // we are in 'study' mode, so only show words that are forgot, ie, we clicked on them during study mode.
          .filter((w) => w.universalPartOfSpeech !== 'PUNCT' && forgot(mode, w))
          .slice(0, numberToShow)
          .sort((b, a) => {
            const bSIndex = parseInt(b.sentenceId); // TODO once we have an INDEX on sentence (stored on sentenceword too!) which tracks the sentences index(order) inside its document, we can just use that here properly
            const aSIndex = parseInt(a.sentenceId);
            if (aSIndex === bSIndex) {
              return b.stanzaId - a.stanzaId;
            } else {
              return bSIndex - aSIndex;
            }
          });

  function markForgot(
    { sentenceId, stanzaId }: SentenceWord,
    mode: StudyType,
    forgot: boolean
  ) {
    // TODO think perhaps of a neater solution than the computed 'forgotMode'
    console.log('about to mark forgot');
    const forgotData: Pick<SentenceWord, 'forgotLISTEN' | 'forgotREAD'> =
      mode === StudyType.Listen
        ? { forgotLISTEN: forgot }
        : { forgotREAD: forgot };
    client.writeQuery({
      query: ForgotSentenceWordDocument,
      data: {
        sentenceWord: {
          __typename: 'SentenceWord',
          sentenceId,
          stanzaId,
          ...forgotData,
        },
      },
      variables: {
        sentenceId,
        stanzaId,
        includeListen: mode === StudyType.Listen,
        includeRead: mode === StudyType.Read,
      },
    });
  }

  function handleWordClick(
    sentenceWord: SentenceWord,
    mode: StudyType,
    studyState: studyStates
  ) {
    const { sentenceId, stanzaId } = sentenceWord;
    if (studyState === 'study') {
      markForgot(sentenceWord, mode, true);
    }

    setRecentWord({ sentenceId, stanzaId });

    client.writeQuery({
      query: gql`
        query UpdateLastClicked($sentenceId: String!, $stanzaId: Int!) {
          sentenceWord(sentenceId: $sentenceId, stanzaId: $stanzaId) {
            stanzaId
            sentenceId
            lastClicked
          }
        }
      `,
      data: {
        sentenceWord: {
          __typename: 'SentenceWord',
          sentenceId,
          stanzaId,
          lastClicked: new Date().getTime(),
        },
      },
      variables: {
        sentenceId,
        stanzaId,
      },
    });
  }

  return (
    <GridContainer
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
    >
      <GridRow item>
        <RowCard elevation={2}>
          <Typography
            className={classes.sentenceHanzi}
            variant="body1"
            align="center"
          >
            <span key={document.id} lang="zh">
              {words.map((w) => (
                // TODO extract this span into some kind of
                // react component with things like onhover behaviour etc
                // TODO make it not clickable if it is puncutation!
                // when doing so extact that common logic from the filter on puncutation (use same constant at least)
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleWordClick(w, mode, studyState)}
                  key={`${w.wordHanzi}-${w.stanzaId}-${w.sentenceId}`}
                >
                  {w.wordHanzi}
                </span>
              ))}
            </span>
            {/* // TODO add part of speech etc */}
          </Typography>
          <Typography variant="body1" align="center">
            {
              studyState === 'check'
                ? document.english
                : '⠀' /*invis char for spacing*/
            }
          </Typography>
          <CardActions classes={{ root: classes.cardActionRoot }}>
            <ButtonGroup classes={{ grouped: classes.buttonGroupGrouped }}>
              <Button
                disabled={studyState === 'study'}
                onClick={() => {
                  setStudyState(studyState === 'check' ? 'study' : 'check');
                }}
                variant="outlined"
                color="default"
                size="medium"
              >
                Hide
              </Button>
              <Button
                // disabled={isLast} // && studyState === 'check'}
                onClick={async () => {
                  if (studyState === 'check') {
                    setConcordanceWord(undefined);
                    // TODO see if I can get typedDocumentnodes for these cache queries?
                    // TODO can I tweak this query so that it only returns documents which are marked as forgotten?
                    const forgotten = client.readQuery({
                      query: ForgottenWordsDocument,
                      variables: {
                        documentId,
                        includeListen: mode === StudyType.Listen,
                        includeRead: mode === StudyType.Read,
                      },
                    });
                    // I assume forgotten could only be null if this documentId didn't exist
                    /// If the cache is missing data for any of the query's fields, readQuery returns null. It does not attempt to fetch data from your GraphQL server.
                    let forgottenHanzi: string[];
                    if (forgotten) {
                      forgottenHanzi = forgotten.document.sentences.reduce<
                        string[]
                      >((acc, cur) => {
                        const forgottenWord = cur.words
                          .filter((w) => {
                            if (mode === StudyType.Listen) {
                              return !!w.forgotLISTEN;
                            } else {
                              return !!w.forgotREAD;
                            }
                          })
                          .map((w) => w.wordHanzi);
                        return [...acc, ...forgottenWord];
                      }, []);
                    } else {
                      forgottenHanzi = [];
                    }

                    const _rv = await studyDocument({
                      variables: {
                        studyType: mode,
                        payload: {
                          documentId,
                          forgottenWordsHanzi: forgottenHanzi,
                        },
                      },
                    });
                    next();
                  }
                  // TODO consider whether isLast is actually necassary now,
                  // given that the parent container stops rendering this component
                  // once it gets to 'finished' state?
                  if (!(isLast && studyState === 'check')) {
                    setStudyState(studyState === 'check' ? 'study' : 'check');
                  }
                }}
                variant="contained"
                color="primary"
                size="medium"
              >
                {rightButtonText[studyState]}
              </Button>
            </ButtonGroup>
          </CardActions>
        </RowCard>
      </GridRow>
      <GridRow item container>
        {wordsToShow.map((word) => (
          <Grid
            className={classes.definitionContainer}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            key={`${word.wordHanzi}-${word.stanzaId}-${word.sentenceId}`}
          >
            <Card
              elevation={2}
              className={clsx(
                word.stanzaId === recentWord.stanzaId &&
                  word.sentenceId === recentWord.sentenceId &&
                  classes.recentCard,
                classes.definition
              )}
            >
              {/* TODO make cardheader fixed (ie doesnt move when scrolling thru card contents - might be as simple as setting overflow behaviour on card contents...) */}
              <CardHeader
                classes={{
                  action: classes.cardHeaderAction,
                  root: classes.cardHeaderRoot,
                }}
                title={<span lang="zh">{word.word.hanzi}</span>}
                action={
                  <ButtonGroup>
                    <IconButton
                      onClick={() => setConcordanceWord(word.word.hanzi)}
                    >
                      <MenuBookIcon color="action"></MenuBookIcon>
                    </IconButton>
                    <IconButton>
                      <RecordVoiceOverIcon color="action" />
                    </IconButton>
                    <IconButton onClick={() => markForgot(word, mode, true)}>
                      <ThumbDown
                        style={{
                          color: forgot(mode, word)
                            ? theme.palette.error.main
                            : theme.palette.action.active,
                        }}
                      />
                    </IconButton>
                    <IconButton
                      // disabled={!forgot(mode, word)}
                      onClick={() => markForgot(word, mode, false)}
                    >
                      <ThumbUp
                        style={{
                          color: forgot(mode, word)
                            ? theme.palette.action.active
                            : theme.palette.success.main,
                        }}
                      />
                    </IconButton>
                  </ButtonGroup>
                }
              />
              <CardContent classes={{ root: classes.cardContentRoot }}>
                {word.word.ccceDefinitions.map((def, i) => {
                  return (
                    <React.Fragment key={`cc-${i}`}>
                      <Typography
                        key={def.id}
                        color="textSecondary"
                        variant="body1"
                      >
                        {def.pinyin}
                      </Typography>
                      {def.definitions.map((d, i) => (
                        <Typography key={`${def.id}-${i}`} variant="body2">
                          {d}
                        </Typography>
                      ))}
                    </React.Fragment>
                  );
                })}
                {/* {word.word.ccceDefinitions[0]?.definitions.map((d) => (
                  <Typography variant="body2">{d}</Typography>
                ))} */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </GridRow>

      <GridRow item>
        {
          concordanceWord ? (
            <Concordance word={concordanceWord}></Concordance>
          ) : (
            <Card></Card>
          )
          // TODO make the concordance handle undefined concordance word, and check that it handles concordance words that it cant find..
        }
      </GridRow>
    </GridContainer>
  );
};

export default Study;
