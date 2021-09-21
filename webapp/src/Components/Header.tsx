import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { DrawerState } from '../Pages/App';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed ??
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1, // look into this
    // TODO confirm that we should remove this transition (I think it was for the older design where the drawer slides over the toolbar)
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
}));

export interface HeaderProps {
  drawer: DrawerState;
}

const Header: React.FC<HeaderProps> = (props) => {
  const classes = useStyles();
  const { drawerOpen, setDrawer } = props.drawer;
  const history = useHistory();
  return (
    <AppBar position={'absolute'} color={'primary'} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          // does this need to change when closed?
          aria-label="open drawer"
          onClick={() => setDrawer(!drawerOpen)}
          //className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          className={classes.menuButton}
          size="large">
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Infinite Input
        </Typography>
        <IconButton onClick={() => history.push('/user')} color="inherit" size="large">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// https://material-ui.com/components/icons/ icons have theme optionsa
