import { RecordVoiceOver } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

const AutoPlayAudio: React.FC<{
  identifier: string;
  type: 'word' | 'document';
}> = ({ identifier, type, ...other }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(null); // remove previous audio
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
      {...other}
      onClick={() => {
        if (audio) {
          audio.play();
        } else {
          // the canplaythrough event hasn't fired yet
        }
      }}
      size="large"
    >
      <RecordVoiceOver color="action" />
    </IconButton>
  );
};

export default AutoPlayAudio;
