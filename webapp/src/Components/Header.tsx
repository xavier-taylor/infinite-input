import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { DrawerState } from '../Pages/App';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
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
          aria-label="open drawer" // does this need to change when closed?
          onClick={() => setDrawer(!drawerOpen)}
          className={classes.menuButton}
          //className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
        >
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
        <IconButton onClick={() => history.push('/user')} color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// https://material-ui.com/components/icons/ icons have theme optionsa
