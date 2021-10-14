import React, { useState } from 'react';
import clsx from 'clsx';
import { Theme, useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import {
  Button,
  ButtonGroup,
  Typography,
  Card,
  useMediaQuery,
  CardActions,
  IconButton,
  CardHeader,
} from '@mui/material';
import { MenuBook, RecordVoiceOver, Done, Close } from '@mui/icons-material';
import Concordance from '../../Components/Concordance';
import {
  Document,
  DocumentByIdDocument,
  DocumentStudyDocument,
  DocumentStudyPayload,
  DocumentWordsDocument,
  ForgotSentenceWordDocument,
  SentenceWord,
  StudyType,
} from '../../schema/generated';
import { gql, useMutation, useQuery } from '@apollo/client';
import { client } from '../..';
import {
  ResponsiveGridItem,
  GridContainer,
  GridRow,
  RowCard,
  DefinitionCard,
  DefinitionCardHeader,
  DefinitionCardContent,
  DefinitionCardHeaderFlexBox,
} from '../../Components/Layout/Common';
import { BLANK_SPACE } from '../../Components/Layout/Constants';
import DefaultAudio from '../../Components/Audio/DefaultAudio';
import AutoPlayAudio from '../../Components/Audio/AutoPlayAudio';

// TODO https://material-ui.com/guides/minimizing-bundle-size/ do that stuff

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroupGrouped: {
      width: '50%', // works for 2 buttons with similar length labels
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
    sentenceHanzi: {
      fontSize: '1.5rem',
    },
    rowCard: {
      borderRadius: 15,
      padding: theme.spacing(1),
    },
  })
);

export type studyStates = 'study' | 'check';
interface StudyProps {
  mode: StudyType;
  documentId: Document['id'];
  isLast: boolean;
  next: () => void; // a function that tells parent we are ready for next document
}
// TODO strip newlines from sentences in database! - ie update ingestion script?

const Sentences: React.FC<StudyProps> = ({
  mode,
  documentId,
  isLast,
  next,
}) => {
  // TODO since we are meant to only be grabbing documents
  // that we already have in the cache, rather than using useQuery, we could
  // use client.readQuery
  const { data, loading, error } = useQuery(DocumentByIdDocument, {
    variables: { id: documentId },
  });

  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const sm = useMediaQuery(theme.breakpoints.down('md'));
  const md = useMediaQuery(theme.breakpoints.down('lg'));
  const lg = useMediaQuery(theme.breakpoints.down('xl'));
  let numberToShow = xs ? 1 : sm ? 2 : md ? 3 : lg ? 4 : 6; // if it wasn't large, it was xl
  const [studyState, setStudyState] = useState<studyStates>('study'); // whether you are reading/listening, or looking at translation etc
  const [concordanceWord, setConcordanceWord] = useState<string | undefined>(
    undefined
  );
  const [recentWord, setRecentWord] = useState<
    Partial<Pick<SentenceWord, 'sentenceId' | 'stanzaId'>>
  >({});

  const [
    studyDocument,
    // { data: _data, loading: _loading, error: _error },
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
    if (sentenceWord.universalPartOfSpeech === 'PUNCT') {
      return;
    }
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
          <CardHeader
            sx={{ pb: 0, pt: 0 }}
            action={
              mode === StudyType.Listen ? (
                <AutoPlayAudio identifier={documentId} type="document" />
              ) : (
                <DefaultAudio
                  invisible={studyState === 'study'}
                  identifier={documentId}
                  type="document"
                />
              )
            }
          />
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
                // TODO make it typography
                <span
                  style={{
                    cursor: `${
                      w.universalPartOfSpeech !== 'PUNCT'
                        ? 'pointer'
                        : 'default'
                    }`,
                  }}
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
                : BLANK_SPACE /*invis char for spacing*/
            }
          </Typography>
          <CardActions style={{ justifyContent: 'center' }}>
            <ButtonGroup classes={{ grouped: classes.buttonGroupGrouped }}>
              <Button
                disabled={studyState === 'study'}
                onClick={() => {
                  setStudyState(studyState === 'check' ? 'study' : 'check');
                }}
                variant="outlined"
              >
                Hide
              </Button>
              <Button
                // disabled={isLast} // && studyState === 'check'}
                onClick={async () => {
                  if (studyState === 'check') {
                    setConcordanceWord(undefined);
                    // This query grabs all the words for the document
                    // I assume documentWords could only be null if this documentId didn't exist (hence the ! operator)
                    // If the cache is missing data for any of the query's fields, readQuery returns null. It does not attempt to fetch data from your GraphQL server.
                    const documentWords = client.readQuery({
                      query: DocumentWordsDocument,
                      variables: {
                        documentId,
                        includeListen: mode === StudyType.Listen,
                        includeRead: mode === StudyType.Read,
                      },
                    })!;
                    const forgottenHanziSet = new Set<string>();
                    const allHanziSet = new Set<string>();
                    // collect all the forgotten words in this document
                    for (let sentence of documentWords.document.sentences) {
                      for (let word of sentence.words) {
                        if (word.universalPartOfSpeech !== 'PUNCT') {
                          allHanziSet.add(word.wordHanzi);
                        }
                        if (
                          mode === StudyType.Listen
                            ? word.forgotLISTEN
                            : word.forgotREAD
                        ) {
                          forgottenHanziSet.add(word.wordHanzi);
                        }
                      }
                    }
                    const forgottenWordsHanzi = Array.from(forgottenHanziSet); // this wont contain PUNCT because PUNCT cannot be clicked on/interacted with
                    const underStoodWordsHanzi = Array.from(allHanziSet).filter(
                      (w) => !forgottenHanziSet.has(w)
                    );
                    // TODO check rv
                    /* const _rv  =*/ await studyDocument({
                      variables: {
                        studyType: mode,
                        payload: {
                          documentId,
                          underStoodWordsHanzi,
                          forgottenWordsHanzi,
                        },
                      },
                    });
                    next();
                  }
                  setStudyState(studyState === 'check' ? 'study' : 'check');
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
          <ResponsiveGridItem
            key={`${word.wordHanzi}-${word.stanzaId}-${word.sentenceId}`}
          >
            <DefinitionCard
              elevation={2}
              className={clsx(
                word.stanzaId === recentWord.stanzaId &&
                  word.sentenceId === recentWord.sentenceId &&
                  classes.recentCard
              )}
            >
              <DefinitionCardHeaderFlexBox>
                {/* marginRight sorcery: https://stackoverflow.com/questions/23621650/how-to-justify-a-single-flexbox-item-override-justify-content https://www.w3.org/TR/css-flexbox-1/#auto-margins */}
                <Typography variant="h6" lang="zh" sx={{ marginRight: 'auto' }}>
                  {word.word.hanzi}
                </Typography>
                <ButtonGroup>
                  <IconButton
                    onClick={() => setConcordanceWord(word.word.hanzi)}
                    size="small"
                  >
                    <MenuBook color="action"></MenuBook>
                  </IconButton>
                  <DefaultAudio
                    size="small"
                    identifier={word.word.hanzi}
                    type="word"
                  />
                  <IconButton
                    onClick={() => markForgot(word, mode, true)}
                    size="small"
                  >
                    <Close
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
                    size="small"
                  >
                    <Done
                      style={{
                        color: forgot(mode, word)
                          ? theme.palette.action.active
                          : theme.palette.success.main,
                      }}
                    />
                  </IconButton>
                </ButtonGroup>
              </DefinitionCardHeaderFlexBox>
              <DefinitionCardContent>
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
              </DefinitionCardContent>
            </DefinitionCard>
          </ResponsiveGridItem>
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

export default Sentences;
