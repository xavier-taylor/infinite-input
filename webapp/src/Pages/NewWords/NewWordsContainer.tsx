import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { useNewWords } from '../../Hooks/newWords';
import NewWords from './NewWords';

interface Props {}

// TODO - on a weekend/mentally fresh day, consider whether this file is required - why not have it all in Study?
export const NewWordsContainer: React.FC<Props> = () => {
  const { nextNewWord, isLast, current, loading, finished } = useNewWords();

  return loading ? (
    <LinearProgress></LinearProgress>
  ) : finished ? (
    <div>
      You have studied all new words for today. (TODO, support studying more)
    </div>
  ) : (
    <NewWords wordHanzi={current} isLast={isLast} next={nextNewWord} />
  );
};