import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { DocumentsDueDocument, StudyType } from '../../schema/generated';
import Study from './Study';

interface StudyContainerProps {
  drawerOpen: boolean;
  mode: StudyType; // note this is a graphql enum!
}
const StudyContainer: React.FC<StudyContainerProps> = ({ drawerOpen, mode }) => {
  
  // if haven't fetchedDocsToRead
  const { data, loading, error } = useQuery(DocumentsDueDocument);
  const [documentIndex, setDocumentIndex] = useState(0);

    
  // TODO continuye here. the aboev query gets the docs to
  // put docs to read in reactive var
  // grab next due doc with another query
  // pass it into the below Study 

  if (loading && !error) {
    return <div>loading</div>;
  } else if (data) {
    const next = () =>
      setDocumentIndex((documentIndex + 1) % data.documents.length);
    return (
      <Study
        mode={mode}
        next={next}
        previous={previous}//some function
        nextAvailable=//some boolean
        previousAvailable=//some boolean
        document={data.documents[documentIndex]}
        drawerOpen={drawerOpen} // this should be in app wide context
      ></Study>
    );
  } else {
    return <div>error</div>;
  }
};

export default StudyContainer;
