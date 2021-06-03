import React from 'react';
import { ParsedDocument } from './index';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchWord: {
      color: theme.palette.success.dark,
    },
    firstSW: {
      color: theme.palette.success.dark,
    },
    table: {
      width: '100%',
      borderSpacing: '0px',
    },
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
  })
);

export interface ConcordanceViewProps {
  documents: ParsedDocument[];
  word: string;
}

const KeyWordInContext: React.FC<ConcordanceViewProps> = ({
  documents,
  word,
}) => {
  const classes = useStyles();
  return (
    <table className={classes.table}>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      {documents.map((document, i) => {
        // TODO handle cases where before or after are empty arrays
        // for the 'center' to work, we need to still render something...
        // TODO these keys aren't proper keys!!!
        return (
          <tr lang="zh">
            <td
              //   style={{ width: '200px' }}
              className={clsx(classes.sentenceFragment, classes.before)}
            >
              {document.before.map((w, i) => (
                <Typography component="span" key={i}>
                  {w.hanzi}
                </Typography>
              ))}
            </td>
            <td className={classes.keyWord}>
              <Typography
                component="span"
                className={clsx(classes.searchWord, classes.firstSW)}
              >
                {document.first?.hanzi}
              </Typography>
            </td>
            <td className={classes.sentenceFragment}>
              {document.after.map((w, i) => (
                <Typography
                  component="span"
                  className={clsx(w.hanzi === word && classes.searchWord)}
                  key={i}
                >
                  {w.hanzi}
                </Typography>
              ))}
            </td>
          </tr>
        );
      })}
    </table>
  );
};

export default KeyWordInContext;
