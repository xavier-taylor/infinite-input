import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Bolt, Help, MenuBook, RecordVoiceOver } from '@mui/icons-material';
import {
  Typography,
  CardActions,
  ButtonGroup,
  buttonGroupClasses,
  Button,
  IconButton,
  CardHeader,
  Box,
  Tooltip,
} from '@mui/material';
import {
  GridContainer,
  GridRow,
  RowCard,
  DefinitionCard,
  DefinitionCardHeader,
  DefinitionCardContent,
  ResponsiveItem,
} from '../../Components/Layout/Common';
import {
  LearningState,
  NewWordStudyDocument,
  StudentWordForLearningDocument,
} from '../../schema/generated';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import AutoPlayAudio from '../../Components/Audio/AutoPlayAudio';
import { BLANK_SPACE } from '../../Components/Layout/Constants';
import DefaultAudio from '../../Components/Audio/DefaultAudio';

type NonLearnedStates = Exclude<LearningState, LearningState.Learned>;
interface NewProperties {
  newLearning: LearningState;
  newDue: string;
}
function getNewProperties(
  currentLearningState: NonLearnedStates,
  understood: boolean
): NewProperties {
  const now = DateTime.now();
  if (!understood) {
    return {
      newLearning: currentLearningState,
      newDue: now.plus({ seconds: 30 }).toUTC().toISO(),
    };
  } else {
    switch (currentLearningState) {
      case LearningState.NotYetLearned:
        return {
          newLearning: LearningState.Meaning,
          newDue: now.plus({ minutes: 2 }).toUTC().toISO(),
        };
      case LearningState.Meaning:
        return {
          newLearning: LearningState.Pronunciation,
          newDue: now.plus({ minutes: 2 }).toUTC().toISO(),
        };
      case LearningState.Pronunciation:
        return {
          newLearning: LearningState.Reading,
          newDue: now.plus({ minutes: 2 }).toUTC().toISO(),
        };
      case LearningState.Reading:
        return {
          newLearning: LearningState.Learned,
          // The due for the read/write cards we will now create.
          newDue: now.plus({ days: 1 }).startOf('day').toUTC().toISO(),
        };
      default:
        const _ex: never = currentLearningState;
        return { newLearning: _ex, newDue: '' };
    }
  }
}

function friendlyLS(ls: NonLearnedStates): { title: string; tooltip: string } {
  switch (ls) {
    case LearningState.NotYetLearned:
      return {
        title: 'New word',
        tooltip: 'Take your time to learn this new word',
      };
    case LearningState.Meaning:
      return {
        title: 'Meaning',
        tooltip: 'Did you remember the meaning of this word?',
      };
    case LearningState.Pronunciation:
      return {
        title: 'Pronunciation',
        tooltip: 'Did you remember the pronunciation of this word?',
      };
    case LearningState.Reading:
      return {
        title: 'Reading',
        tooltip:
          'Were you able to read this word, remembering pronunciation and meaning?',
      };
    default:
      const _ex: never = ls;
      return { title: _ex, tooltip: _ex };
  }
}

interface Props {
  wordHanzi: string;
  isLast: boolean;
  next: () => void; // call this !after! you have updated cache values(and backend)
}

const NewWords: React.FC<Props> = ({ wordHanzi, next }) => {
  // This component must handle updating the state of words
  // in the apollo store itself. ie with writequery

  // But to control the reactive vars, it should use functions
  // that get provided to it.

  // TODO continue here
  /**
   * 1. fetch the current word for learning from the cache- done
   * CURRENTLY at step 2 over in NewWords.tsx
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
  const [
    studyWord,
    {
      // data: _data,
      loading: loadingMutation,
      // error: _error, called: _called
    },
  ] = useMutation(NewWordStudyDocument);

  async function handleWordStudy(
    currentLS: NonLearnedStates,
    understood: boolean
  ) {
    const { newDue, newLearning } = getNewProperties(currentLS, understood);
    /* const _res = */ await studyWord({
      variables: { newDue, newLearning, hanzi: wordHanzi },
    });
    next();
  }
  const [studyState, setStudyState] = useState<'test' | 'check'>('test'); // whether you are reading/listening, or looking at translation etc
  const testing = studyState === 'test'; // test is when you cant see all the info
  // TODO
  if (loading) return <div></div>;
  else if (error) return <div>{JSON.stringify(error)}</div>;
  else if (!data) return <div>no data?</div>;
  const mode = data.studentWord.learning as NonLearnedStates; // we don't return learned states
  return (
    <GridContainer
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <GridRow item>
        <RowCard elevation={2}>
          <CardHeader
            disableTypography
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" display="inline">
                  {friendlyLS(mode).title}
                </Typography>
                <Tooltip
                  enterTouchDelay={0}
                  title={friendlyLS(mode).tooltip}
                  placement="bottom"
                >
                  <IconButton size="small">
                    <Help />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            action={
              <ButtonGroup>
                {(studyState === 'check' ||
                  [LearningState.NotYetLearned, LearningState.Meaning].includes(
                    mode
                  )) &&
                  ([
                    LearningState.NotYetLearned,
                    LearningState.Meaning,
                  ].includes(mode) ? (
                    <AutoPlayAudio identifier={wordHanzi} type="word" />
                  ) : (
                    <DefaultAudio identifier={wordHanzi} type="word" />
                  ))}
                <IconButton onClick={() => null} size="large">
                  <MenuBook color="action"></MenuBook>
                </IconButton>
              </ButtonGroup>
            }
          ></CardHeader>
          <Typography align="center" variant="h2" lang="zh">
            {data.studentWord.hanzi}
          </Typography>
          <CardActions style={{ justifyContent: 'center' }}>
            <ButtonGroup
              sx={{
                [`.${buttonGroupClasses.grouped}:first-of-type:hover`]: {
                  borderColor: (theme) => theme.palette.error.dark,
                },
              }}
              variant="outlined"
            >
              <Button
                disabled={
                  testing ||
                  loadingMutation ||
                  data.studentWord.learning === LearningState.NotYetLearned
                }
                onClick={() => {
                  handleWordStudy(
                    data.studentWord.learning as NonLearnedStates, // words that are 'Learned' do not appear here
                    false
                  );
                  setStudyState('test');
                }}
                color="error"
                sx={{
                  width: '50%',
                }}
              >
                Again
              </Button>
              <Button
                onClick={() => {
                  if (testing) {
                    setStudyState('check');
                  } else {
                    handleWordStudy(
                      data.studentWord.learning as NonLearnedStates, // words that are 'Learned' do not appear here
                      true
                    );
                    setStudyState('test'); // TODO consider putting this before handleWordStudy
                  }
                }}
                disabled={loadingMutation}
                sx={{ width: '50%' }}
              >
                {testing ? 'Show' : 'Good'}
              </Button>
            </ButtonGroup>
          </CardActions>
        </RowCard>
      </GridRow>
      <GridRow
        item
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {data.studentWord.word.ccceDefinitions.map((def, i) => (
          <ResponsiveItem>
            <DefinitionCard elevation={2}>
              <DefinitionCardHeader
                title={
                  <Typography variant="h6">
                    {studyState === 'check' ||
                    [
                      LearningState.NotYetLearned,
                      LearningState.Meaning,
                    ].includes(mode)
                      ? def.pinyin
                      : BLANK_SPACE}
                  </Typography>
                }
              />

              <DefinitionCardContent>
                <Box
                  lang="zh"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      display="inline"
                      color="GrayText"
                      variant="body1"
                    >
                      简：
                    </Typography>
                    <Typography display="inline" variant="body1">
                      {def.simplified}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      display="inline"
                      color="GrayText"
                      variant="body1"
                    >
                      繁：
                    </Typography>
                    <Typography display="inline" variant="body1">
                      {def.traditional}
                    </Typography>
                  </Box>
                </Box>
                <ul
                  style={{
                    paddingLeft: '1rem',
                    listStyle: 'square',
                  }}
                >
                  {(studyState === 'check' ||
                    [
                      LearningState.NotYetLearned,
                      LearningState.Pronunciation,
                    ].includes(mode)) &&
                    def.definitions.map((d, i) => (
                      <li key={`${def.id}-${i}`}>
                        <Typography variant="body2">{d}</Typography>
                      </li>
                    ))}
                </ul>
              </DefinitionCardContent>
            </DefinitionCard>
          </ResponsiveItem>
        ))}
      </GridRow>
    </GridContainer>
  );
};

export default NewWords;
