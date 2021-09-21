import { Card, Grid, styled } from '@mui/material';

// TODO improve this, get rid of reliance on hardcode 64px (which is height of appbar ONLY IN SOME SITUATIONS)
// the minus should instead come from theme.mixins.toolbar/ from the height of the appbar
//position: 'relative', NOTE there might be a way to do this using position rather than the hacky height thing above...
export const GridContainer = styled(Grid)({
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
