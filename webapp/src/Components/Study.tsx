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
} from '@material-ui/core';
import clsx from 'clsx';
//TODO understand this whole page of code

// TODO play around with Box and this copyright to understand it, then remove it
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Xavier Taylor
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
  })
);

export interface ISentence {
  hanzi: string;
  pinyin: string;
  english: string;
}

interface StudyProps {}

const Study: React.FC<StudyProps> = (props) => {
  const classes = useStyles();
  const [i, setI] = useState(0);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //if (loading) return <div>loading</div>;
  //if (error) return <div>error</div>;

  const sentences = [
    {
      hanzi: '你刚才说什么了？',
      pinyin: 'Nǐ gāngcái shuō shénme le?',
      english: 'What did you just say?',
      words: [
        {
          hanzi: '你',
        },
        {
          hanzi: '刚才',
        },
        {
          hanzi: '说',
        },
        {
          hanzi: '什么',
        },
        {
          hanzi: '了',
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
        },
        {
          hanzi: '谁',
        },
        {
          hanzi: '来',
        },
        {
          hanzi: '了',
        },
      ],
    },
  ];
  const next = () => setI((i + 1) % sentences.length);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Sentences */}
        <Grid item xs={12} md={8} lg={9}>
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
        </Grid>
        {/* Word Definitions */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <dl>
              {sentences[i].words.map((w) => (
                <dt>{w.hanzi}</dt>
              ))}
            </dl>
          </Paper>
        </Grid>
        {/* Grammar points */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <p>grammar point</p>
            <p>grammar point</p>
            <p>grammar point</p>
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Study;
