import { useQuery } from '@apollo/client';
import { StudentWordForLearningDocument } from '../../schema/generated';

interface Props {
  wordHanzi: string;
  isLast: boolean;
  next: () => void; // call this !after! you have updated cache values(and backend)
}
const NewWords: React.FC<Props> = ({ wordHanzi }) => {
  // This component must handle updating the state of words
  // in the apollo store itself. ie with writequery

  // But to control the reactive vars, it should use functions
  // that get provided to it.

  // TODO continue here
  /**
   * 1. fetch the current word for learning from the cache
   * 2. refactor some code out of Study and create study UI
   *   the study ui shows whatever part is indicated by the learning state, (just show pinyin rather than sound for now)
   * then shows all when u click next etc
   * 3. if you click 'wrong' update local cache as well as server, then call next()
   * 4. if you click 'right' update local cahce as well as server then call next()
   * 5. consider whether 'isLast' is actually required, since parent container doesn't render this guy
   *   once it gets to 'finished' state
   *
   */

  // This could be a cache query instead... ie client.readQuery.
  const { data, loading, error } = useQuery(StudentWordForLearningDocument, {
    variables: {
      hanzi: wordHanzi,
    },
  });
  // TODO
  if (loading) return <div></div>;
  else if (error) return <div>{JSON.stringify(error)}</div>;
  else if (!data) return <div>no data?</div>;

  return <div>{data.studentWord.hanzi}</div>;
};

export default NewWords;
