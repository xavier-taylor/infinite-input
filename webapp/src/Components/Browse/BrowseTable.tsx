import { useMutation, useQuery } from '@apollo/client';
import { ResultOf } from '@graphql-typed-document-node/core';
import { Lock, LockOpen } from '@mui/icons-material';

import {
  Table as MuiTable,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  ButtonGroup,
  IconButton,
} from '@mui/material';
import React, { useMemo } from 'react';
import { CellProps, Column, useTable } from 'react-table';
import {
  BrowseWordDocument,
  StudentWordState,
  ToggleSwLockDocument,
} from '../../schema/generated';

interface RowActionsProps {
  state: StudentWordState;
  hanzi: string | undefined;
  locked: boolean | undefined;
}

const RowActions: React.FC<CellProps<RowData, RowActionsProps>> = ({
  cell: {
    value: { hanzi, locked, state },
  },
}) => {
  // TODO when the table has many rows, will we need special refetch logic after the query?
  // (for example, to refetch all the data in the table)
  const [studyDocument, { data, loading, error }] = useMutation(
    ToggleSwLockDocument,
    {
      variables: { hanzi },
    }
  );

  return (
    <ButtonGroup>
      <IconButton // cant lock or unlock non-existent words. and we dont want you re locking words coz havent implemented yet
        onClick={() => studyDocument()}
        disabled={
          state === StudentWordState.NoSuchWord || locked === false || loading
        }
      >
        {locked === true || locked === undefined ? <Lock /> : <LockOpen />}
      </IconButton>
    </ButtonGroup>
  );
};

export interface TableProps {
  apiData: ResultOf<typeof BrowseWordDocument>['browseWord'];
}
// barebones RowData drawing from top level contents of StudentWord
interface RowData {
  hanzi: string | 'NA';
  state: 'Word not available in app' | 'Word available in app';
  // dateLearned: string | undefined;
  position: number | 'NA';
  locked: 'Locked' | 'Unlocked' | 'NA'; // NA when no_such_word
  actions: RowActionsProps;
  // due: string | undefined;
}

type BrowseColumn = Column<RowData>;

const BrowseTable: React.FC<TableProps> = ({ apiData }) => {
  function lockedToString(locked: boolean): 'Locked' | 'Unlocked' {
    return locked ? 'Locked' : 'Unlocked';
  }
  const data = useMemo<Array<RowData>>(
    () => [
      {
        hanzi: apiData.studentWord?.hanzi ?? 'NA',
        state:
          apiData.studentWordState === StudentWordState.NoSuchWord
            ? 'Word not available in app'
            : 'Word available in app',
        position: apiData.studentWord?.position ?? 'NA',
        locked: apiData.studentWord
          ? lockedToString(apiData.studentWord.locked)
          : 'NA',
        actions: {
          hanzi: apiData.studentWord?.hanzi ?? undefined,
          state: apiData.studentWordState,
          locked: apiData.studentWord?.locked ?? undefined,
        },
      },
    ],
    // When making the table have many rows, ensure you get these dependencies right to avoid re-renders
    [apiData.studentWord, apiData.studentWordState]
  );
  const columns = useMemo<Array<BrowseColumn>>(
    () => [
      {
        Header: 'Word',
        accessor: 'hanzi',
      },
      {
        Header: 'State',
        accessor: 'state',
      },
      { Header: 'Position', accessor: 'position' },
      {
        Header: 'Locked',
        accessor: 'locked',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: RowActions,
      },
    ],
    [] // empty array means memoized once and never recalculated
  );

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <MuiTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map((hg) => (
          <TableRow {...hg.getHeaderGroupProps()}>
            {hg.headers.map((col) => (
              <TableCell {...col.getHeaderProps()}>
                {col.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <TableCell {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </MuiTable>
  );
};

export default BrowseTable;

// https://react-table.tanstack.com/docs/examples/sub-components could use this for word subdetails

// (future) TODO return variants with suffixes like 刀子 孢子 etc
// probably add a key like 'relatedWords' to the return payload which is an array...
// For now rendering a single row table, but in future will support broader search,
// so in future will have many rows.
// Ideally, we want a table that can show tens of thousands for rows, and support select all
// for batch functions.
// trying 'react-table' to start with.
// future design: - have a 'select all' and row level select checkboxs.
// future design: cardcontent has a 'footer' like component which shows all the extra word information
// for last selected row -like in anki - unless of course, all the extra word information can just
// fit in the table.
//

// TODO if 'learned', also return teh student_word_read and student_word_listen

// TODO enable routing, so when you search for a word you get taken to
// browse/[word], so use can click back and forwards in the browser and get expected behaviour

// TODO when swapping words back into locked state, might need
// to refetch the query that got our 'new words' to learn (as well, I suppose, as any queries for orphan words?)
// - FOR NOW ONLY ALLOW UNLOCK
