import React from 'react';
import {
  Drawer,
  IconButton,
  Divider,
  List,
  ListSubheader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HearingIcon from '@material-ui/icons/Hearing';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SearchIcon from '@material-ui/icons/Search';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import BrushIcon from '@material-ui/icons/Brush';
import { DrawerState } from './App';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const mainMenu = [
  {
    name: 'Read',
    icon: <MenuBookIcon />,
  },
  {
    name: 'Listen',
    icon: <HearingIcon />,
  },
  {
    name: 'Browse',
    icon: <SearchIcon />,
  },
];

const drawerWidth = 240; // TODO make this dynamic/responsive

// TODO understand these styles
const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
}));

interface DrawerProps {
  drawer: DrawerState;
  page: {
    pageIndex: number;
    setPage: Function;
  };
}

const MenuDrawer: React.FC<DrawerProps> = (props) => {
  const { drawerOpen, setDrawer } = props.drawer;
  // eslint-disable-next-line
  const { pageIndex, setPage } = props.page;
  const classes = useStyles();
  const gt600px = useMediaQuery((theme: any) => theme.breakpoints.up('sm')); // TODO typescript

  return (
    <Drawer
      variant={gt600px ? 'permanent' : 'temporary'}
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !drawerOpen && classes.drawerPaperClose
        ),
      }}
      open={drawerOpen}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={() => setDrawer(!drawerOpen)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <div>
        <List>
          {mainMenu.map((m, i) => (
            <ListItem onClick={() => setPage(i)} key={i} button>
              <ListItemIcon>{m.icon}</ListItemIcon>
              <ListItemText primary={m.name} />
            </ListItem>
          ))}
        </List>
      </div>
      <Divider />
      <div>
        <List>
          <ListSubheader inset>Settings</ListSubheader>
          <ListItem button>
            <ListItemIcon>
              <BrushIcon />
            </ListItemIcon>
            <ListItemText primary="Appearance" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <KeyboardIcon />
            </ListItemIcon>
            <ListItemText primary="Keyboard Shortcuts" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsApplicationsIcon />
            </ListItemIcon>
            <ListItemText primary="Study Settings" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default MenuDrawer;
