import { RecordVoiceOver } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

// This audio component isn't autoplay - and it doesn't load until you click it.
const DefaultAudio: React.FC<{
  identifier: string;
  type: 'word' | 'document';
}> = ({ identifier, type }) => {
  // audio starts null
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  // audio gets set to null on new identifier
  useEffect(() => {
    setAudio(null); // remove previous audio
  }, [identifier, type]);

  // we get the ogg and set audio on click
  const getAndPlay = useCallback(() => {
    const newAudio = new Audio(
      `http://localhost:4001/api/tts/${type}/${identifier}.oga`
    );
    newAudio.addEventListener('canplaythrough', () => {
      newAudio.play();
      setAudio(newAudio);
    });
  }, [identifier, type]);

  return (
    <IconButton
      onClick={() => {
        if (audio) {
          audio.play();
        } else {
          getAndPlay();
        }
      }}
      size="large"
    >
      <RecordVoiceOver color="action" />
    </IconButton>
  );
};

export default DefaultAudio;
