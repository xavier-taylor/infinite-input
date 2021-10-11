import { StudentWordStudy, StudyType } from '../../schema/generated';

interface StudyProps {
  // the combination of mode and hanzi tells you which cache object to grab.
  mode: StudyType;
  hanzi: StudentWordStudy['hanzi'];
  isLast: boolean;
  next: () => void; // a function that tells parent we are ready for next document
}

export const Words: React.FC<StudyProps> = ({}) => {
  return <div></div>;
};
