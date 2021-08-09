import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { useDocuments } from '../../Hooks/documents';
import { StudyType } from '../../schema/generated';
import Study from './Study';

interface Props {
  drawerOpen: boolean;
  mode: StudyType;
}
export const StudyContainer: React.FC<Props> = ({ mode, drawerOpen }) => {
  const { nextDocument, isLast, current, loading, finished } = useDocuments(
    mode
  );

  return loading ? (
    <LinearProgress></LinearProgress>
  ) : finished ? (
    <div>You have studied all sentences for today.</div>
  ) : (
    <Study
      documentId={current}
      isLast={isLast}
      next={nextDocument}
      drawerOpen={drawerOpen}
      mode={mode}
    />
  );
};
