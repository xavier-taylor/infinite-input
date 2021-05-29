import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';

import { ThumbDown } from '@material-ui/icons';
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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: '100%',
    },
    hanzi: {
      // TODO move this into the theme
      fontFamily: "'Noto Serif SC', serif",
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
      //   tableLayout: 'auto',
      width: '100%',
      borderSpacing: '0px',
    },
    sentence: {},
    sentenceFragment: {
      padding: '0px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '50%', // TODO this insane combination of width and maxWidth works, but
      // doesnt seem like something I should rely on. Can I get advise on how to do this in a different way?
      maxWidth: '0',
      //   overflowX: 'auto',
      //   textOverflow: 'clip', // ellipsis is broken in Chrome! TODO look at fix
      //   whiteSpace: 'nowrap', //everything said i need to use this for textOverflow, but actually dont seem to?
    },
    keyWord: {
      padding: '0px',
      whiteSpace: 'nowrap',
      //   overflowX: 'auto',
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
          title: classes.hanzi, // TODO how can I put common rules like this hanzi one in the theme etc?
        }}
        title={searchWord}
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
            interface word {
              hanzi: string;
            }
            interface accumulator {
              before: word[];
              first: word | undefined;
              after: word[];
            }
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
              <tr className={classes.sentence}>
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

              //   <div className={classes.sentence} key={i}>
              //     {sentence.words.map(
              //       function (
              //         this: { searchWordFirstI: number | undefined },
              //         word,
              //         i
              //       ) {
              //         // TODO make this more beautiful, perhaps move to helper function
              //         const isSearchWord = word.hanzi === searchWord;
              //         let isFirstSW = false;
              //         if (this.searchWordFirstI === undefined && isSearchWord) {
              //           this.searchWordFirstI = i;
              //           isFirstSW = true;
              //         }

              //         return (
              //           <span
              //             className={clsx(
              //               isSearchWord && classes.searchWord,
              //               isFirstSW && classes.firstSW
              //             )}
              //           >
              //             {word.hanzi}
              //           </span>
              //         );
              //       },
              //       { searchWordFirstI: undefined }
              //     )}
              //   </div>
            );
          })}
        </table>
      </CardContent>
    </Card>
  );
};

export default Concordance;
