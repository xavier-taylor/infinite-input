import React from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import clsx from 'clsx';

import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
  LinearProgress,
} from '@mui/material';
import KeyWordInContext from './KWICView';
import ListView from './ListView';
import { useQuery } from '@apollo/client';
import { ConcordanceDocument } from '../../schema/generated';
import { ResultOf } from '@graphql-typed-document-node/core';
import { Maybe } from 'graphql/jsutils/Maybe';

// TODO add english of sentence:
// in list view, just after.
// in aligned view, as a mouse over? or an accordion? https://material-ui.com/components/accordion/
// TODO rename concordance container

type ConcordanceDocumentObject = ResultOf<
  typeof ConcordanceDocument
>['concordanceDocs'][number];
type ConcordanceWord = ConcordanceDocumentObject['sentences'][number]['words'][number];

export interface ParsedDocument {
  before: ConcordanceWord[];
  first: ConcordanceWord | undefined;
  after: ConcordanceWord[];
  english?: Maybe<string>;
}

// TODO consider making this whole thing a type returned from the gql server
// rather than doing this data manipulation at the frontend...
function parseDocument(
  doc: ConcordanceDocumentObject,
  word: string
): ParsedDocument {
  const words: ConcordanceWord[] = doc.sentences.reduce<ConcordanceWord[]>(
    (acc, cur) => {
      acc.push(...cur.words);
      return acc;
    },
    []
  );

  return words.reduce(
    (acc, cur) => {
      // TODO proofread this logic, I was tired
      if (acc.first === undefined && cur.wordHanzi === word) {
        acc.first = cur;
      } else if (acc.first === undefined) {
        acc.before.push(cur);
      } else {
        acc.after.push(cur);
      }
      return acc;
    },
    {
      before: [],
      first: undefined,
      after: [],
      english: doc.english,
    } as ParsedDocument
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: '100%',
    },
    cardHeaderRoot: {
      padding: theme.spacing(1),
      paddingBottom: '0px',
    },
    cardHeaderAction: {
      padding: theme.spacing(0.5),
    },
    ccRoot: {
      paddingTop: '0px',
      padding: theme.spacing(1),
      paddingBottom: '0px',
      '&:last-child': {
        paddingBottom: '0px',
      },
      height: `calc(100% - ${theme.spacing(5.5)})`,
    },
    ccRootAligned: {
      display: 'flex',
      justifyContent: 'center',
      overflowY: 'auto',
    },
    ccRootList: {
      overflowX: 'auto',
    },
  })
);

interface ConcordanceProps {
  word: string;
}

// The desire here is to present a 'KWIC' style view (key word in context)
const Concordance: React.FC<ConcordanceProps> = ({ word }) => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(ConcordanceDocument, {
    variables: { word },
  });
  // Todo make this aligned value part of global state
  // if necassary to keep it consistent across different word's concordances
  const [state, setState] = React.useState({
    aligned: true,
  });

  // TODO handle this any
  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  if (loading) {
    return <LinearProgress />;
    // TODO replace this with https://material-ui.com/components/skeleton/
  } else if (data) {
    const parsedDocument = data.concordanceDocs.map((doc) =>
      parseDocument(doc, word)
    );
    return (
      <Card className={classes.card} elevation={2}>
        <CardHeader
          classes={{
            action: classes.cardHeaderAction,
            root: classes.cardHeaderRoot,
          }}
          title={<span lang="zh">{word}</span>}
          action={
            <FormControlLabel
              control={
                <Switch
                  checked={state.aligned}
                  onChange={handleChange}
                  name="aligned"
                  color="primary"
                />
              }
              label="Align"
            />
          }
        />
        <CardContent
          classes={{
            root: clsx(
              state.aligned ? classes.ccRootAligned : classes.ccRootList,
              classes.ccRoot
            ),
          }}
        >
          {state.aligned ? (
            <KeyWordInContext word={word} documents={parsedDocument} />
          ) : (
            <ListView word={word} documents={parsedDocument} />
          )}
        </CardContent>
      </Card>
    );
  } else {
    return <div>error: {error?.message} </div>;
  }
};

export default Concordance;
