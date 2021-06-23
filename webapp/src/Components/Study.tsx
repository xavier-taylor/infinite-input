import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Link,
  Card,
  useMediaQuery,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import { ThumbDown } from '@material-ui/icons';
import Concordance from './Concordance';
import { DocumentsAllQuery, DocumentsAllDocument } from '../schema/generated';
import { useQuery } from '@apollo/client';
import { Document, SentenceWord } from '../schema/generated';

// TODO https://material-ui.com/guides/minimizing-bundle-size/ do that stuff

const hardcodedDocuments: Document[] = [
  {
    chinese: '你刚才说什么了？', // actually we don't pass this around, instead pass around list of words
    english: 'What did you just say?',
    id: 'test',
    sentences: [
      {
        id: '1',
        chinese: 'omitted',
        words: [
          // TODO make these words more realistiic given the data. just like this for basic UI layout
          // ie each hanzi maps to many simp/trad/pinyin/definition sets
          // in fact, just see these words in the database to see what I mean
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            wordHanzi: '你',
            universalPartOfSpeech: 'upos',
            due: false,
            word: {
              hskChar2010: 1,
              hskWord2010: 1,
              hanzi: '你',
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  definitions: [
                    'you (informal, as opposed to courteous 您[nin2])',
                  ],
                  pinyin: 'ni3',
                },
              ],
            },
          },
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            universalPartOfSpeech: 'upos',
            due: false,
            wordHanzi: '你',
            word: {
              hanzi: '你',
              hskChar2010: 1,
              hskWord2010: 1,
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  definitions: [
                    'you (informal, as opposed to courteous 您[nin2])',
                  ],
                  pinyin: 'ni3',
                },
              ],
            },
          },
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            wordHanzi: '刚才', // note how in cedict there are two rows for this word!WORD
            universalPartOfSpeech: 'upos',
            due: false,
            word: {
              hanzi: '刚才', // note how in cedict there are two rows for this word!
              hskChar2010: 1,
              hskWord2010: 1,
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  definitions: [
                    '(just) a moment ago',
                    'just now / a moment ago ',
                  ],
                  pinyin: 'gang1 cai2',
                  // in reality, a definition, at least a cedict one, is a mapping from
                  //(trad,simp, pinyin)-> definitions, so a given simp hanzi itself can
                  // map to multiple of these rows! - UI must handle this!
                  // in reality the 'definition' card will be a little complex.
                },
              ],
            },
          },
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            universalPartOfSpeech: 'upos',
            due: false,
            wordHanzi: '说', //in cedict, an example of same chars but dif pinyin meriting 2 rows，then a third row for a trad variant!
            word: {
              hanzi: '说', //in cedict, an example of same chars but dif pinyin meriting 2 rows，then a third row for a trad variant!
              hskChar2010: 1,
              hskWord2010: 1,
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  definitions: [
                    'to speak',
                    'to say',
                    'to explain',
                    'to scold',
                    'to tell off',
                    'a theory (typically the last character in a compound, as in 日心說|日心说 heliocentric theory)',
                  ],
                  /*
          96691	"说"	"說"	"shui4"	"{""to persuade""}"
96692	"说"	"說"	"shuo1"	"{""to speak"",""to say"",""to explain"",""to scold"",""to tell off"",""a theory (typically the last character in a compound, as in 日心說|日心说 heliocentric theory)""}"
96775	"说"	"説"	"shuo1"	"{""variant of 說|说[shuo1]""}"
          */
                  pinyin: 'shuo1',
                },
              ],
            },
          },
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            universalPartOfSpeech: 'upos',
            wordHanzi: '什么',
            due: false,
            word: {
              hskChar2010: 1,
              hskWord2010: 1,
              hanzi: '什么',
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  definitions: ['what', 'something', 'anything'],
                  pinyin: 'shen2 me5',
                },
              ],
            },
          },
          {
            lemma: 'l',
            partOfSpeech: 'pos',
            wordHanzi: '了',
            universalPartOfSpeech: 'upos',
            due: false,
            word: {
              hskChar2010: 1,
              hskWord2010: 1,
              hanzi: '了',
              ccceDefinitions: [
                {
                  simplified: 'a',
                  traditional: 'b',
                  pinyin: 'le5',
                  definitions: [
                    '(completed action marker)',
                    '(modal particle indicating change of state, situation now)',
                    '(modal particle intensifying preceding clause)',
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
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
  drawerOpen: boolean;
}

const Study: React.FC<StudyProps> = ({ drawerOpen }) => {
  // Just practising getting the end to end data flow
  const res = useQuery(DocumentsAllDocument);
  const documents = [...hardcodedDocuments];
  if (res.loading === false && res.data) {
    documents.push(...res.data.documents);
  }

  const classes = useStyles();
  const [i, setI] = useState(0); // todo improve var name
  const [selectedWordIndexes, updateSWI] = useState<number[]>([]);
  type studyStates = 'study' | 'check';
  const [studyState, setStudyState] = useState<studyStates>('study'); // whether you are reading/listening, or looking at translation etc
  const leftButtonText: Record<studyStates, string> = {
    study: 'Undo',
    check: 'Hide',
  };
  const rightButtonText: Record<studyStates, string> = {
    study: 'Show',
    check: 'Next',
  };
  // this selectWord guy clsxexists within a given sentence
  const selectWord = (i: number) =>
    updateSWI((prev) => {
      const next = prev.filter((n) => n !== i);
      next.push(i);
      return next;
    });
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //if (loading) return <div>loading</div>;
  //if (error) return <div>error</div>;

  const next = () => setI((i + 1) % documents.length);
  const doc = documents[i];
  const words: SentenceWord[] = [];
  // TODO don't want to ahve to do this kind of iteration in front end
  // probably should consider having a flat array of sentencewords coming back from the gql server as part of the Document type
  for (let s of doc.sentences) {
    words.push(...s.words);
  }
  // TODO: since I am not really using the grid, perhaps remove it and just have a simple flexbox?

  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));

  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  let numberToShow = xs ? 1 : sm ? 2 : md ? 3 : lg ? 4 : 6; // if it wasn't large, it was xl

  const wordsToShow = words.slice(0, numberToShow);

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
            <span lang="zh">{doc.chinese}</span>
          </Typography>
          <Typography variant="body1" align="center">
            {doc.english}
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
        {wordsToShow.map((word) => (
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
              {/* TODO add an action, whether in CardHeader or CardActions that goes to a concordance view for the word, ideally sorted by sentences the user understands */}
              <CardHeader
                classes={{
                  action: classes.cardHeaderAction,
                  root: classes.cardHeaderRoot,
                }}
                title={<span lang="zh">{word.word.hanzi}</span>}
                subheader={word.word.ccceDefinitions[0]?.pinyin}
                action={
                  <IconButton>
                    <ThumbDown color="error" />
                  </IconButton>
                }
              />
              <CardContent classes={{ root: classes.cardContentRoot }}>
                {word.word.ccceDefinitions[0]?.definitions.map((d) => (
                  <Typography variant="body2">{d}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid className={classes.rowContainer} item>
        <Concordance></Concordance>
      </Grid>
    </Grid>
  );
};

export default Study;
