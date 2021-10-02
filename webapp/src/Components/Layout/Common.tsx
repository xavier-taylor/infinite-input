import {
  Card,
  CardHeader,
  Grid,
  styled,
  cardHeaderClasses,
  CardContent,
  Box,
} from '@mui/material';

// TODO improve this, get rid of reliance on hardcode 64px (which is height of appbar ONLY IN SOME SITUATIONS)
// the minus should instead come from theme.mixins.toolbar/ from the height of the appbar
//position: 'relative', NOTE there might be a way to do this using position rather than the hacky height thing above...
export const GridContainer = styled(Grid)({
  height: 'calc(100% - 64px)',
});

export const PageBox = styled(Box)({
  height: 'calc(100% - 64px)',
});

export const GridRow = styled(Grid)(({ theme }) => ({
  height: `calc(33% - ${theme.spacing(1)})`,
  margin: theme.spacing(1),
  marginBottom: 0,
  flexWrap: 'nowrap',
  width: `calc(100% - ${theme.spacing(2)})`,
}));

export const RowCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
}));

const GridItemWrapper = styled(Grid)(({ theme }) => ({
  height: `calc(100% - ${theme.spacing(1)})`,
  margin: theme.spacing(0.5),
  '&:nth-of-type(1)': {
    marginLeft: '0px',
  },
  '&:last-child': {
    marginRight: '0px',
  },
}));

// Used in the Sentence Study (Study.tsx) mode
export const ResponsiveGridItem: React.FC = (props) => {
  return (
    <GridItemWrapper {...props} item xs={12} sm={6} md={4} lg={3} xl={2}>
      {props.children}
    </GridItemWrapper>
  );
};

// used in new word study, similar to ResponsiveGridItem
export const ResponsiveItem = styled('div')(({ theme }) => ({
  display: 'inline-block',
  height: `calc(100% - ${theme.spacing(1)})`,
  margin: theme.spacing(0.5),
  '&:nth-of-type(1)': {
    marginLeft: '0px',
  },
  '&:last-child': {
    marginRight: '0px',
  },
  [theme.breakpoints.up('xs')]: {
    width: `calc(${(12 / 12) * 100}% - ${theme.spacing(1)})`,
  },
  [theme.breakpoints.up('sm')]: {
    width: `calc(${(6 / 12) * 100}% - ${theme.spacing(1)})`,
  },
  [theme.breakpoints.up('md')]: {
    width: `calc(${(4 / 12) * 100}% - ${theme.spacing(1)})`,
  },
  [theme.breakpoints.up('lg')]: {
    width: `calc(${(3 / 12) * 100}% - ${theme.spacing(1)})`,
  },
  [theme.breakpoints.up('xl')]: {
    width: `calc(${(2 / 12) * 100}% - ${theme.spacing(1)})`,
  },
}));

// Usually wrapped in a Responsive*Item
export const DefinitionCard = styled(Card)(({ theme }) => ({
  overflowY: 'auto',
  whiteSpace: 'normal',
  borderRadius: 7.5,
  height: '100%',
}));

/* TODO make cardheaders (both types) fixed (ie doesnt move when scrolling thru card contents - might be as simple as setting overflow behaviour on card contents...) */
export const DefinitionCardHeader = styled(CardHeader)(({ theme }) => ({
  whiteSpace: 'nowrap',
  padding: theme.spacing(1),
  paddingBottom: '0px',
  [`.${cardHeaderClasses.action}`]: {
    padding: theme.spacing(0.5),
  },
}));

// Inspired by the DefinitionCardHeader, but outgrew the CardHeader constraints
export const DefinitionCardHeaderFlexBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end', // sx={{ marginRight: 'auto' }} on first item to make it stick to the left lol
  flexWrap: 'wrap',
  padding: theme.spacing(1),
  paddingBottom: '0px',
  [`.${cardHeaderClasses.action}`]: {
    padding: theme.spacing(0.5),
  },
}));

export const DefinitionCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  // TODO making this paddingBottom work, currently it is getting overwritten by some pseudo class or something?? Is it? this is old
  paddingBottom: '0px',
  paddingTop: '0px',
  '&:last-child': {
    paddingBottom: '0px',
  },
}));
