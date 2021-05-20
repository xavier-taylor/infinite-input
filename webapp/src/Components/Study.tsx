import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
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
} from '@material-ui/core';
import clsx from 'clsx';

const sentences = [
  {
    hanzi: '你刚才说什么了？', // actually we don't pass this around, instead pass around list of words
    pinyin: 'Nǐ gāngcái shuō shénme le?', // ui shouldnt actually have a line of pinyin like this
    english: 'What did you just say?',
    words: [
      // TODO make these words more realistiic given the data. just like this for basic UI layout
      // ie each hanzi maps to many simp/trad/pinyin/definition sets
      // in fact, just see these words in the database to see what I mean
      {
        hanzi: '你',
        definitions: ['you (informal, as opposed to courteous 您[nin2])'],
        pinyin: 'ni3',
      },
      {
        hanzi: '刚才', // note how in cedict there are two rows for this word!
        review: true, // review cards are prioritized for view on small viewports
        definitions: ['(just) a moment ago', 'just now / a moment ago '],
        pinyin: 'gang1 cai2',
        // in reality, a definition, at least a cedict one, is a mapping from
        //(trad,simp, pinyin)-> definitions, so a given simp hanzi itself can
        // map to multiple of these rows! - UI must handle this!
        // in reality the 'definition' card will be a little complex.
      },
      {
        hanzi: '说', //in cedict, an example of same chars but dif pinyin meriting 2 rows，then a third row for a trad variant!
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
      {
        hanzi: '什么',
        definitions: ['what', 'something', 'anything'],
        pinyin: 'shen2 me5',
      },
      {
        hanzi: '了',
        pinyin: 'le5',
        definitions: [
          '(completed action marker)',
          '(modal particle indicating change of state, situation now)',
          '(modal particle intensifying preceding clause)',
        ],
        review: true,
      },
    ],
  },
  {
    hanzi: '刚才谁来了',
    pinyin: 'Gāngcái shéi lái le? ',
    english: 'Who came just now?',
    words: [
      {
        hanzi: '刚才',
        review: true,
        definitions: ['(just) a moment ago', 'just now / a moment ago '],
        pinyin: 'gang1 cai2',
      },
      {
        hanzi: '谁',
        definitions: ['who', 'also pr. [shui2]'],
        pinyin: 'shei2',
      },
      {
        hanzi: '来',
        pinyin: 'lai2',
        definitions: [
          'to come',
          'to arrive',
          'to come round',
          'ever since',
          'next',
        ],
      },
      {
        hanzi: '了',
        pinyin: 'le5',
        definitions: [
          '(completed action marker)',
          '(modal particle indicating change of state, situation now)',
          '(modal particle intensifying preceding clause)',
        ],
        review: true,
      },
    ],
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowContainer: {
      height: `calc(33% - ${theme.spacing(1)}px)`,
      margin: theme.spacing(1),
      marginBottom: 0,
    },
    row: {
      height: '100%',
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
  })
);

interface StudyProps {}

const Study: React.FC<StudyProps> = (props) => {
  const classes = useStyles();
  const [i, setI] = useState(0); // todo improve var name
  const [selectedWordIndexes, updateSWI] = useState<number[]>([]);
  // this selectWord guy exists within a given sentence
  const selectWord = (i: number) =>
    updateSWI((prev) => {
      const next = prev.filter((n) => n !== i);
      next.push(i);
      return next;
    });
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //if (loading) return <div>loading</div>;
  //if (error) return <div>error</div>;

  const next = () => setI((i + 1) % sentences.length);
  const sentence = sentences[i];
  // TODO: since I am not really using the grid, perhaps remove it and just have a simple flexbox?

  // NEXT UP - make the number of word cards rendered a function of the screen size, perhaps using media query?
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      className={classes.gridContainer}
    >
      <Grid className={classes.rowContainer} item>
        <Card className={classes.row} elevation={2}>
          <div>{sentence.hanzi}</div>
          <div>{sentence.english}</div>
        </Card>
      </Grid>
      <Grid className={classes.rowContainer} item>
        <Paper className={classes.row} elevation={2}>
          <Grid container>
            {sentences[i].words.map((word) => (
              <Grid item xs={12} sm={6} md={3} lg={2} xl={1}>
                <Card>
                  <div>{word.hanzi}</div>
                  <div>{word.pinyin}</div>
                  <div>
                    {word.definitions.map((d) => (
                      <span>{d}</span>
                    ))}
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid className={classes.rowContainer} item>
        <Card className={classes.row} elevation={2}>
          <div>'Some Grammar or other information</div>
          <div>'Perhaps, until I add it, a pretty picture</div>
        </Card>
      </Grid>
    </Grid>
  );
};

/**
           <Paper className={fixedHeightPaper}>
            <p>{sentences[i].hanzi}</p>
            <p>{sentences[i].pinyin}</p>
            <p>{sentences[i].english}</p>
            <ButtonGroup variant="outlined" color="primary">
              <Button onClick={next} size="large" color="secondary">
                Again
              </Button>
              <Button onClick={next} size="large">
                Good
              </Button>
            </ButtonGroup>
          </Paper>
 */

export default Study;
