// TODO when swapping words back into locked state, might need
// to refetch the query that got our 'new words' to learn (as well, I suppose, as any queries for orphan words?)

import { TextFieldsOutlined } from '@mui/icons-material';
import Search from '@mui/icons-material/Search';
import {
  Box,
  CardHeader,
  FormControl,
  Input,
  TextField,
  Typography,
  InputLabel,
  Card,
  FilledInput,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useRef } from 'react';
import {
  GridContainer,
  GridRow,
  PageBox,
  RowCard,
} from '../../Components/Layout/Common';

// new words can be unlocked at start or bottom of queue.
// default 'start of queue' so truly new words(once I am getting from my study
// are above words id had previously studied on anki)

const WordSearch: React.FC = () => {
  const [name, setName] = React.useState('Composed TextField');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    console.log(name); // do I need to add debounce, or can we
    // just make it only search onclick for now (yes we can)
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
        value={name}
        onChange={handleChange}
        label="词语"
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
const Browse: React.FC<Props> = () => {
  return (
    <PageBox>
      <Card sx={{ m: 1 }}>
        <CardHeader
          disableTypography
          title={<Typography variant="body1">Browse words!</Typography>}
          action={<WordSearch />}
        ></CardHeader>
      </Card>
    </PageBox>
  );
};

export default Browse;
