import React from 'react';
import { ConcordanceViewProps } from './KWICView';

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
  })
);

const ListView: React.FC<ConcordanceViewProps> = ({ documents, word }) => {
  const classes = useStyles();
  return (
    <>
      {documents.map((doc) => (
        <div lang="zh">
          {doc.before.map((w, i) => (
            <Typography component="span" key={i}>
              {w.wordHanzi}
            </Typography>
          ))}
          {
            <Typography component="span" key={word} className={classes.firstSW}>
              {doc.first?.wordHanzi}
            </Typography>
          }
          {doc.after.map((w, i) => (
            <Typography
              className={clsx(w.wordHanzi === word && classes.searchWord)}
              component="span"
              key={i}
            >
              {w.wordHanzi}
            </Typography>
          ))}
        </div>
      ))}
    </>
  );
};

export default ListView;
