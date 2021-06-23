import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { DocumentsAllDocument } from '../../schema/generated';
import Study from './Study';

interface StudyContainerProps {
  drawerOpen: boolean;
}
const StudyContainer: React.FC<StudyContainerProps> = ({ drawerOpen }) => {
  const { data, loading, error } = useQuery(DocumentsAllDocument);
  const [documentIndex, setDocumentIndex] = useState(0);

  if (loading && !error) {
    return <div>loading</div>;
  } else if (data) {
    const next = () =>
      setDocumentIndex((documentIndex + 1) % data.documents.length);
    return (
      <Study
        next={next}
        document={data.documents[documentIndex]}
        drawerOpen={drawerOpen}
      ></Study>
    );
  } else {
    return <div>error</div>;
  }
};

export default StudyContainer;
