import { useQuery } from '@apollo/client';
import { ResultOf } from '@graphql-typed-document-node/core';
import { TextFieldsOutlined } from '@mui/icons-material';
import Search from '@mui/icons-material/Search';
import {
  Box,
  CardHeader,
  TextField,
  Typography,
  Card,
  FilledInput,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CardContent,
  LinearProgress,
} from '@mui/material';
import React, { KeyboardEventHandler, useRef, useState } from 'react';
import {
  GridContainer,
  GridRow,
  PageBox,
  RowCard,
} from '../../Components/Layout/Common';
import {
  BrowseWordDocument,
  LearningState,
  StudentWordState,
} from '../../schema/generated';
import { useTable, Column } from 'react-table';
import BrowseTable from '../../Components/Browse/BrowseTable';

// new words can be unlocked at start or bottom of queue.
// default 'start of queue' so truly new words(once I am getting from my study
// are above words id had previously studied on anki)

// test with : 行 着  龜 龟 畫 画 證 证

const WordSearch: React.FC<{
  setSearchWord: (w: string | undefined) => void;
}> = ({ setSearchWord }) => {
  const [word, setWord] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSearchWord(word);
    event.preventDefault();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        autoFocus
        variant="outlined"
        value={word}
        onChange={handleChange}
        label="词语"
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setSearchWord(word);
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="search"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                edge="end"
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Box>
  );
};

interface Props {}
// TODO move other componetns into sepearate component files
const Browse: React.FC<Props> = () => {
  const [searchWord, setSearchWord] = useState<string | undefined>(undefined);

  const { data, loading, error } = useQuery(BrowseWordDocument, {
    skip: searchWord === '' || searchWord === undefined,
    variables: { word: searchWord },
  });

  return (
    <PageBox p={1}>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          disableTypography
          title={
            <Typography variant="body1">Browse and unlock words</Typography>
          }
          action={<WordSearch setSearchWord={setSearchWord} />}
        ></CardHeader>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            data && <BrowseTable apiData={data.browseWord} />
          )}
        </CardContent>
      </Card>
    </PageBox>
  );
};

export default Browse;
