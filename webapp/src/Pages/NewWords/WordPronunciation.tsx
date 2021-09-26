import { useLazyQuery, useQuery } from '@apollo/client';
import { RecordVoiceOver } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { WordPronunciationDocument } from '../../schema/generated';

const WordPronunciation: React.FC<{ wordHanzi: string }> = ({ wordHanzi }) => {
  console.log('Render of WordPronduncation: ', wordHanzi);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [getPronunciation, { data, loading, error, called }] = useLazyQuery(
    WordPronunciationDocument,
    {
      onError: (e) => {
        console.log(JSON.stringify(e));
      },
      onCompleted: (data) => {
        console.log('fetched data');
        if (data.wordPronunciation.url) {
          const newAudio = new Audio(data.wordPronunciation.url);
          setAudio(newAudio);
          newAudio.play();
        } else {
          // backend didnt have that url
        }
      },
    }
  );

  const { data: localData } = useQuery(WordPronunciationDocument, {
    variables: { hanzi: wordHanzi },
    fetchPolicy: 'cache-only',
  });

  //   const [lastFetched, setLastFetched] = useState<string | null>(null);

  // Set audio to null when prop changes
  useEffect(() => {
    setAudio(null);
  }, [wordHanzi]);
  return (
    <IconButton
      // TODO have backend guarantee audio by also using azure
      onClick={async () => {
        if (audio) {
          console.log('audio');
          audio.play();
        } else if (localData?.wordPronunciation.url) {
          console.log('local data');
          if (localData.wordPronunciation.url) {
            const newAudio = new Audio(localData.wordPronunciation.url);
            setAudio(newAudio);
            newAudio.play();
          } else {
            // backend didnt have that url
            console.log('backend didnt have');
          }
        } else {
          console.log('local query didnt have, trying to fetch');
          getPronunciation({ variables: { hanzi: wordHanzi } });
        }
      }}
      size="large"
    >
      <RecordVoiceOver color="action" />
    </IconButton>
  );
};

export default WordPronunciation;

// Notes - this file is very much a work in progress. it kind of works for returning forvo pronunciations
// where they exist. But it is obviously quite messy and incomplete.
// Putting it on pause for now while working out how to use azure tts or a similar provider.
