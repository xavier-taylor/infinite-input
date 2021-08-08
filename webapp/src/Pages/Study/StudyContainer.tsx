import { ReactiveVar, useQuery } from '@apollo/client';
import React from 'react';
import {
  // TODO why it have this name
  DueDocument,
  DueQueryVariables,
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

// Continue here
/*
Need to make
1. wordsToReadVar, wordsToListenVar,
2. rename haveFetchedDocsToListen to haveFetchedListenDue etc, same for read
3. listenedWordsVar, readWordsVar
4. use them here - to put the orphan words taht the query returns into em

5. Move the logic for the the initial fetch of read data
   out of here. For now, put it in App.tsx

6. This page stays 'StudyContainer', and becomes parametized by
    both Study type (listen vs read) and thing type (word vs document)

7. for wrd study, for now just render a div that prints all the due words
8. rename Study to DocumentStudy
9. make a file called 'WordStudy.tsx' - it just returns point 7
10. extract stuff out of  'DocumentStudy' that doesn't belong to it (ie word cards)
11. make WordStudy similar to Document study - with a concordance view possible
 - as there are possibly documents with our word but other words we dont' know


*/

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
  const variables: DueQueryVariables = { studyType: mode };
  const { data, loading, error } = useQuery(DueDocument, {
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

  const ids = useReactiveVar(toStudyVar);
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
    haveFetchedDocsVar(true);
    toStudyVar(data.due.documents.map((d) => d.id));
    console.log(`got ${data.due.documents.length} due`);
    return null; // TODO fix this shit
  } else if (haveFetchedDocs) {
    if (ids.length > 0 && haveFetchedDocs) {
      const nextDocumentToStudy = ids[0];

      return (
        <Study
          mode={mode}
          next={nextDocument}
          nextAvailable={ids.length > 1}
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
