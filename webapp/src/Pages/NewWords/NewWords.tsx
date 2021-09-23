import { useMutation, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import { MenuBook, RecordVoiceOver } from '@mui/icons-material';
import {
  Grid,
  styled,
  Card,
  Typography,
  CardActions,
  ButtonGroup,
  buttonGroupClasses,
  Button,
  IconButton,
  CardHeader,
  Box,
} from '@mui/material';
import { BLANK_SPACE } from '../../Components/Layout/Constants';
import {
  GridContainer,
  GridRow,
  RowCard,
  DefinitionCard,
  DefinitionCardHeader,
  DefinitionCardContent,
  ResponsiveGridItem,
  ResponsiveItem,
} from '../../Components/Layout/Common';
import {
  NewWordStudyDocument,
  StudentWordForLearningDocument,
} from '../../schema/generated';
import { useState } from 'react';
import { studyStates } from '../Study/Study';
import { nextTick } from 'process';

const fakeData = {
  studentWord: {
    __typename: 'StudentWord',
    due: '2021-09-11T14:00:00.000Z',
    hanzi: '上游',
    learning: 'meaning',
    word: {
      __typename: 'Word',
      ccceDefinitions: [
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '無一事而不學，無一時而不學，無一處而不得',
          traditional: '上游無一事而不學，無一時而不學，無一處而',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
        {
          id: '1',
          __typename: 'CCCEDefinition',
          definitions: [
            'upper reaches (of a river)',
            'upper level',
            'upper echelon',
            'upstream',
          ],
          pinyin: 'shang4 you2',
          simplified: '上游',
          traditional: '上游',
        },
      ],
      hanzi: '上游',
    },
  },
};

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
    { data: _data, loading: loadingMutation, error: _error, called: _called },
  ] = useMutation(NewWordStudyDocument);

  async function handleWordStudy(understood: boolean, hanzi: string) {
    const _res = await studyWord({ variables: { understood, hanzi } });
    next();
  }
  const [studyState, setStudyState] = useState<studyStates>('study'); // whether you are reading/listening, or looking at translation etc
  const studying = studyState === 'study';
  // TODO
  if (loading) return <div></div>;
  else if (error) return <div>{JSON.stringify(error)}</div>;
  else if (!data) return <div>no data?</div>;

  const mode = data.studentWord.learning;
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
            action={
              <ButtonGroup>
                <IconButton onClick={() => null} size="large">
                  <MenuBook color="action"></MenuBook>
                </IconButton>
                <IconButton size="large">
                  <RecordVoiceOver color="action" />
                </IconButton>
              </ButtonGroup>
            }
          ></CardHeader>
          <Typography align="center" variant="h2" lang="zh">
            {fakeData.studentWord.hanzi}
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
                disabled={studying || loadingMutation}
                onClick={() => handleWordStudy(false, wordHanzi)}
                color="error"
                sx={{
                  width: '50%',
                }}
              >
                Again
              </Button>
              <Button
                onClick={() => handleWordStudy(true, wordHanzi)}
                disabled={loadingMutation}
                sx={{ width: '50%' }}
              >
                Good
              </Button>
            </ButtonGroup>
          </CardActions>
        </RowCard>
      </GridRow>
      <GridRow
        item
        sx={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {studying &&
          fakeData.studentWord.word.ccceDefinitions.map((def, i) => (
            <ResponsiveItem>
              <DefinitionCard elevation={2}>
                <DefinitionCardHeader
                  title={<Typography variant="h6">{def.pinyin}</Typography>}
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
                  {def.definitions.map((d, i) => (
                    <Typography key={`${def.id}-${i}`} variant="body2">
                      {d}
                    </Typography>
                  ))}
                </DefinitionCardContent>
              </DefinitionCard>
            </ResponsiveItem>
          ))}
      </GridRow>
    </GridContainer>
  );
};

export default NewWords;
