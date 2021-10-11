import { LinearProgress } from '@mui/material';
import React from 'react';
import { useWords } from '../../Hooks/words';

import { StudyType } from '../../schema/generated';
import { Words } from './Words';

interface Props {
  mode: StudyType;
}

// TODO - on a weekend/mentally fresh day, consider whether this file is required - why not have it all in Study?

export const WordsContainer: React.FC<Props> = ({ mode }) => {
  const { nextWord, isLast, current, loading, finished } = useWords(mode);

  return loading ? (
    <LinearProgress></LinearProgress>
  ) : finished ? (
    <div>You have studied all words for now.</div>
  ) : (
    <Words hanzi={current} isLast={isLast} next={nextWord} mode={mode} />
  );
};
