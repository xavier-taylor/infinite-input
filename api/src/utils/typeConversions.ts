import { learning_state } from '../repository/sql-model';
import { LearningState } from '../schema/gql-model';

export function toGQLLearningStateEnum(ls: learning_state): LearningState {
  switch (ls) {
    case learning_state.not_yet_learned:
      return LearningState.NotYetLearned;
    case learning_state.meaning:
      return LearningState.Meaning;
    case learning_state.pronunciation:
      return LearningState.Pronunciation;
    case learning_state.reading:
      return LearningState.Reading;
    case learning_state.learned:
      return LearningState.Learned;
    default:
      const _ex: never = ls;
      return _ex;
  }
}

export function toSQLLearningStateEnum(ls: LearningState): learning_state {
  switch (ls) {
    case LearningState.NotYetLearned:
      return learning_state.not_yet_learned;
    case LearningState.Meaning:
      return learning_state.meaning;
    case LearningState.Pronunciation:
      return learning_state.pronunciation;
    case LearningState.Reading:
      return learning_state.reading;
    case LearningState.Learned:
      return learning_state.learned;
    default:
      const _ex: never = ls;
      return _ex;
  }
}
