import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import KeyWordInContext from './KWICView';
import ListView from './ListView';

const searchWord = 'Ab'; //TODO change it to key word
const sentences = [
  {
    words: [
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'gg',
      },
      {
        hanzi: 'Klaa',
      },
      {
        hanzi: 'asd',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'aaa',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'dd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'ADS',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
      { hanzi: 'right' },
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'gg',
      },
      {
        hanzi: 'Klaa',
      },
      {
        hanzi: 'asd',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'aaa',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'dd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'ADS',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
      { hanzi: 'right' },
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'gg',
      },
      {
        hanzi: 'Klaa',
      },
      {
        hanzi: 'asd',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'aaa',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'Ab',
      },
      {
        hanzi: 'dd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi: 'ADS',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
    ],
  },
  {
    words: [
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
      {
        hanzi: 'ADA',
      },
      {
        hanzi: 'asd',
      },
      {
        hanzi: 'Ab',
      },
      { hanzi: 'right' },
      {
        hanzi:
          'ADSasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdasd;lkasj;dalskdj;alksfaslkdas;lkdalsdkjalskdjal;ksjdaslkdjalk;sdjal;ksdjl;aksdjl;kasjdlkasjdlk;asjdl;kajsdl;kjasl;dkjaslk;djaslk;jdl;aksjdl;aksjdl;kasjdl;kasjd;lkasjdl;kajsdl;aksjdl;askjd;lkasjd;lkajsdl;kjasdl;kjasl;kjasd;laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',
      },
    ],
  },
];

interface word {
  hanzi: string;
}

export interface ParsedDocument {
  before: word[];
  first: word | undefined;
  after: word[];
}

function seperateWords(words: word[]): ParsedDocument {
  return words.reduce<ParsedDocument>(
    (acc, cur, i) => {
      // TODO proofread this logic, I was tired
      if (acc.first === undefined && cur.hanzi === searchWord) {
        acc.first = cur;
      } else if (acc.first === undefined) {
        acc.before.push(cur);
      } else {
        acc.after.push(cur);
      }
      return acc;
    },
    { before: [], first: undefined, after: [] }
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: '100%',
    },
    cardHeaderRoot: {
      padding: theme.spacing(1),
      paddingBottom: '0px',
    },
    cardHeaderAction: {
      padding: theme.spacing(0.5),
    },
    ccRoot: {
      paddingTop: '0px',
      padding: theme.spacing(1),
      paddingBottom: '0px',
      '&:last-child': {
        paddingBottom: '0px',
      },
      height: `calc(100% - ${theme.spacing(5.5)}px)`,
    },
    ccRootAligned: {
      display: 'flex',
      justifyContent: 'center',
    },
    ccRootList: {
      overflowX: 'auto',
    },
  })
);

interface ConcordanceProps {}

// The desire here is to present a 'KWIC' style view (key word in context)
const Concordance: React.FC<ConcordanceProps> = () => {
  const classes = useStyles();
  // Todo make this aligned value part of global state
  // if necassary to keep it consistent across different word's concordances
  const [state, setState] = React.useState({
    aligned: true,
  });

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const documents = sentences.map((sentence) => seperateWords(sentence.words));

  return (
    <Card className={classes.card} elevation={2}>
      <CardHeader
        classes={{
          action: classes.cardHeaderAction,
          root: classes.cardHeaderRoot,
        }}
        title={<span lang="zh">{searchWord}</span>}
        action={
          <FormControlLabel
            control={
              <Switch
                checked={state.aligned}
                onChange={handleChange}
                name="aligned"
                color="primary"
              />
            }
            label="Align"
          />
        }
      />
      <CardContent
        classes={{
          root: clsx(
            state.aligned ? classes.ccRootAligned : classes.ccRootList,
            classes.ccRoot
          ),
        }}
      >
        {state.aligned ? (
          <KeyWordInContext word={searchWord} documents={documents} />
        ) : (
          <ListView word={searchWord} documents={documents} />
        )}
      </CardContent>
    </Card>
  );
};

export default Concordance;
