import React, { useEffect } from 'react';
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
import { DrawerState } from '../Pages/App';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router-dom';

// because I couldn't understand the baloney here: https://material-ui.com/guides/typescript/#usage-of-component-prop
// I didn't end up using the react Router Link (for example, as a component prop to the ListItems), instead I use the useHistory hook hehehe

const mainMenu = [
  {
    name: 'Read',
    icon: <MenuBookIcon />,
    path: '/read',
  },
  {
    name: 'Listen',
    icon: <HearingIcon />,
    path: '/listen',
  },
  {
    name: 'Browse',
    icon: <SearchIcon />,
    path: '/browse',
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
}

const MenuDrawer: React.FC<DrawerProps> = (props) => {
  const { drawerOpen, setDrawer } = props.drawer;
  const history = useHistory();
  const classes = useStyles();
  const gt600px = useMediaQuery((theme: any) => theme.breakpoints.up('sm')); // TODO typescript
  useEffect(() => {
    if (!gt600px) {
      setDrawer(false);
    }
  }, [gt600px, setDrawer]);

  //https://material.io/design/layout/responsive-layout-grid.html#ui-regions for def of perm vs tmp
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
            <ListItem onClick={() => history.push(m.path)} key={i} button>
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
          <ListItem onClick={() => history.push('/settings/appearance')} button>
            <ListItemIcon>
              <BrushIcon />
            </ListItemIcon>
            <ListItemText primary="Appearance" />
          </ListItem>
          <ListItem onClick={() => history.push('/settings/keyboard')} button>
            <ListItemIcon>
              <KeyboardIcon />
            </ListItemIcon>
            <ListItemText primary="Keyboard Shortcuts" />
          </ListItem>
          <ListItem onClick={() => history.push('/settings/study')} button>
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
