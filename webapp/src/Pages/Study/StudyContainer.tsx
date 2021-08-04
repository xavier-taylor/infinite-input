import { ReactiveVar, useQuery } from '@apollo/client';
import React from 'react';
import {
  DocumentsDueDocument,
  DocumentsDueQueryVariables,
  StudyType,
} from '../../schema/generated';
import Study from './Study';
import { useReactiveVar } from '@apollo/client';
import {
  docsToListenVar,
  docsToReadVar,
  DocumentIdList,
  haveFetchedDocsToListenVar,
  haveFetchedDocsToReadVar,
  listenedDocsVar,
  readDocsVar,
} from '../../cache';

interface StudyContainerProps {
  drawerOpen: boolean;
  mode: StudyType; // note this is a graphql enum!
}

const StudyContainer: React.FC<StudyContainerProps> = ({
  drawerOpen,
  mode,
}) => {
  let haveFetchedDocsVar: ReactiveVar<boolean>;
  let toStudyVar: ReactiveVar<DocumentIdList>;
  let studiedVar: ReactiveVar<DocumentIdList>;
  if (mode === StudyType.Read) {
    haveFetchedDocsVar = haveFetchedDocsToReadVar;
    toStudyVar = docsToReadVar;
    studiedVar = readDocsVar;
  } else {
    // if use third study type add here
    haveFetchedDocsVar = haveFetchedDocsToListenVar;
    toStudyVar = docsToListenVar;
    studiedVar = listenedDocsVar;
  }

  const haveFetchedDocs = useReactiveVar(haveFetchedDocsVar);
  const variables: DocumentsDueQueryVariables = { studyType: mode };
  const { data, loading, error } = useQuery(DocumentsDueDocument, {
    variables,
    skip: haveFetchedDocs,
  });

  const nextDocument = () => {
    const toStudy = toStudyVar();
    const studied = studiedVar();
    if (toStudy.length > 0) {
      studiedVar([...studied, toStudy[0]]);
      toStudyVar(toStudy.slice(1));
    }
  };

  const prevDocument = () => {
    const toStudy = toStudyVar();
    const studied = studiedVar();
    if (studied.length > 0) {
      toStudyVar([studied[studied.length - 1], ...toStudy]);
      studiedVar(studied.slice(0, studied.length - 1));
    }
  };

  const ids = useReactiveVar(docsToReadVar);
  const readDocIds = useReactiveVar(readDocsVar);
  if (loading) {
    return <div>loading</div>;
  } else if (error) {
    return <div>error</div>;
  } else if (!data && !haveFetchedDocs) {
    console.log('nde');
    console.log(error);
    console.log(loading);
    console.log(data);
    return <div> no data error</div>;
  } else if (data && !haveFetchedDocs) {
    haveFetchedDocsToReadVar(true);
    docsToReadVar(data.documentsDue.map((d) => d.id));
    console.log(`got ${data.documentsDue.length} due`);
    return null; // TODO fix this shit
  } else if (haveFetchedDocs) {
    if (ids.length > 0 && haveFetchedDocs) {
      const nextDocumentToStudy = ids[0];

      return (
        <Study
          mode={mode}
          next={nextDocument}
          previous={prevDocument}
          nextAvailable={ids.length > 1}
          prevAvailable={readDocIds.length > 0}
          documentId={nextDocumentToStudy}
          drawerOpen={drawerOpen} // this should be in app wide context
        ></Study>
      );
    } else if (ids.length === 0 && haveFetchedDocs) {
      return <div>congrats ur done</div>;
    } else if (ids.length === 0 && !haveFetchedDocs) {
      return <div>loading</div>;
    } else {
      return <div>error state</div>; // TODO tightne up code here
    }
  } else {
    return <div>error state??</div>; // TODO fix this shit
  }
};

export default StudyContainer;
