import React, { useState } from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
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
import { ThumbDown } from '@material-ui/icons';
import Concordance from '../../Components/Concordance';
import { Document, SentenceWord, StudyType } from '../../schema/generated';

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
    sentenceRowRoot: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    rowContainer: {
      height: `calc(33% - ${theme.spacing(1)}px)`,
      margin: theme.spacing(1),
      marginBottom: 0,
      flexWrap: 'nowrap',
      width: `calc(100% - ${theme.spacing(2)}px)`,
    },
    rowCard: {
      borderRadius: 15,
      padding: theme.spacing(1),
    },
    gridContainer: {
      height: 'calc(100% - 64px)', // TODO improve this, get rid of reliance on hardcode 64px (which is height of appbar ONLY IN SOME SITUATIONS)
      // the minus should instead come from theme.mixins.toolbar/ from the height of the appbar
      //position: 'relative', NOTE there might be a way to do this using position rather than the hacky height thing above...
      // bottom: 0,
      // top: 0,
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
  drawerOpen: boolean; // TODO determine if we need this prop!
  document: Document;
  mode: StudyType;
  next: () => void;
}
// TODO strip newlines from sentences in database! - ie update ingestion script?

const Study: React.FC<StudyProps> = ({ drawerOpen, document, next }) => {
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
  console.log(concordanceWord);

  const [selectedWordIndexes, updateSWI] = useState<number[]>([]);

  const leftButtonText: Record<studyStates, string> = {
    study: 'Undo',
    check: 'Hide',
  };
  const rightButtonText: Record<studyStates, string> = {
    study: 'Show',
    check: 'Next',
  };
  const selectWord = (i: number) =>
    updateSWI((prev) => {
      const next = prev.filter((n) => n !== i);
      next.push(i);
      return next;
    });
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const words: SentenceWord[] = [];
  // CONSIDER have the api return a flat array of sentence words
  for (let s of document.sentences) {
    words.push(...s.words);
  }
  // TODO: since I am not really using the grid, perhaps remove it and just have a simple flexbox?

  const wordsToShow = words
    .filter((w) => w.universalPartOfSpeech !== 'PUNCT')
    .slice(0, numberToShow);

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      className={classes.gridContainer}
    >
      <Grid className={classes.rowContainer} item>
        <Card classes={{ root: classes.sentenceRowRoot }} elevation={2}>
          <Typography
            className={classes.sentenceHanzi}
            variant="body1"
            align="center"
          >
            <span key={document.id} lang="zh">
              {words.map((w) => (
                <span key={`${w.wordHanzi}-${w.id}-${w.sentenceId}`}>
                  {w.wordHanzi}
                </span>
              ))}
            </span>
            {/* // TODO add part of speech etc */}
          </Typography>
          <Typography variant="body1" align="center">
            {document.english}
          </Typography>
          <CardActions classes={{ root: classes.cardActionRoot }}>
            <ButtonGroup classes={{ grouped: classes.buttonGroupGrouped }}>
              <Button
                onClick={() => {
                  if (studyState === 'study') {
                    next();
                  }
                  setStudyState(studyState === 'check' ? 'study' : 'check');
                }}
                variant="outlined"
                color="default"
                size="medium"
              >
                {leftButtonText[studyState]}
              </Button>
              <Button
                onClick={() => {
                  if (studyState === 'check') {
                    setConcordanceWord(undefined);
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
        </Card>
      </Grid>
      <Grid className={classes.rowContainer} item container>
        {studyState === 'check' &&
          wordsToShow.map((word) => (
            <Grid
              className={classes.definitionContainer}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
            >
              <Card className={classes.definition}>
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
                      <IconButton>
                        <ThumbDown color="error" />
                      </IconButton>
                    </ButtonGroup>
                  }
                />
                <CardContent classes={{ root: classes.cardContentRoot }}>
                  {word.word.ccceDefinitions.map((def) => {
                    return (
                      <>
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
                      </>
                    );
                  })}
                  {/* {word.word.ccceDefinitions[0]?.definitions.map((d) => (
                  <Typography variant="body2">{d}</Typography>
                ))} */}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid className={classes.rowContainer} item>
        {
          concordanceWord ? (
            <Concordance word={concordanceWord}></Concordance>
          ) : (
            <Card></Card>
          )
          // TODO make the concordance handle undefined concordance word, and check that it handles concordance words that it cant find..
        }
      </Grid>
    </Grid>
  );
};

export default Study;
