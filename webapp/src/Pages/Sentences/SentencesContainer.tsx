import { LinearProgress } from '@mui/material';
import React from 'react';
import { useDocuments } from '../../Hooks/documents';
import { StudyType } from '../../schema/generated';
import Sentences from './Sentences';

interface Props {
  mode: StudyType;
}

// TODO - on a weekend/mentally fresh day, consider whether this file is required - why not have it all in Study?

export const SentencesContainer: React.FC<Props> = ({ mode }) => {
  const { nextDocument, isLast, current, loading, finished } = useDocuments(
    mode
  );

  return loading ? (
    <LinearProgress></LinearProgress>
  ) : finished ? (
    <div>You have studied all sentences for today.</div>
  ) : (
    <Sentences
      documentId={current}
      isLast={isLast}
      next={nextDocument}
      mode={mode}
    />
  );
};
