import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import clsx from 'clsx';

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
];

interface word {
  hanzi: string;
}
interface accumulator {
  before: word[];
  first: word | undefined;
  after: word[];
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
    cardContentRoot: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
      paddingBottom: '0px',
      '&:last-child': {
        paddingBottom: '0px',
      },
    },
    searchWord: {
      color: 'red',
    },
    firstSW: {
      color: 'purple',
    },
    table: {
      width: '100%',
      borderSpacing: '0px',
    },
    sentence: {},
    sentenceFragment: {
      padding: '0px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '50%', // NOTE this insane combination of width and maxWidth works, but
      // doesnt seem like something I should rely on. Can I get advise on how to do this in a different way?
      maxWidth: '0',
    },
    keyWord: {
      padding: '0px',
      whiteSpace: 'nowrap',
    },
    before: {
      direction: 'rtl',
      textAlign: 'right',
    },
    context: {},
    kw: {},
  })
);

interface ConcordanceProps {}

// The desire here is to present a 'KWIC' style view (key word in context)
const Concordance: React.FC<ConcordanceProps> = ({}) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    aligned: true,
  });

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
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
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <table className={classes.table}>
          <colgroup>
            <col className={classes.context} />
            <col className={classes.kw} />
            <col className={classes.context} />
          </colgroup>
          {sentences.map((sentence, i) => {
            const a = sentence.words.reduce<accumulator>(
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
            // TODO handle cases where before or after are empty arrays
            // for the 'center' to work, we need to still render something...
            // TODO these keys aren't proper keys!!!
            return (
              <tr lang="zh" className={classes.sentence}>
                <td
                  //   style={{ width: '200px' }}
                  className={clsx(classes.sentenceFragment, classes.before)}
                >
                  {a.before.map((w, i) => (
                    <span key={i}>{w.hanzi}</span>
                  ))}
                </td>
                <td className={classes.keyWord}>
                  <span className={clsx(classes.searchWord, classes.firstSW)}>
                    {a.first?.hanzi}
                  </span>
                </td>
                <td className={classes.sentenceFragment}>
                  {a.after.map((w, i) => (
                    <span
                      className={clsx(
                        w.hanzi === searchWord && classes.searchWord
                      )}
                      key={i}
                    >
                      {w.hanzi}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </table>
      </CardContent>
    </Card>
  );
};

export default Concordance;
