import React, { useEffect, useState } from 'react';
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
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import BrushIcon from '@material-ui/icons/Brush';
import { DrawerState } from '../Pages/App';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router-dom';
import { MenuListItem } from './MenuListItem';

// Fake data waiting on real integration
const FAKE_NEW_WORDS = 10;
const FAKE_READ_WORDS = 15;
const FAKE_READ_DOCUMENTS = 124;
const FAKE_LISTEN_WORDS = 3;
const FAKE_LISTEN_DOCUMENTS = 209;

const drawerWidth = 240; // TODO make this dynamic/responsive

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
  loadingReading: boolean;
  loadingListening: boolean;
}

const MenuDrawer: React.FC<DrawerProps> = (props) => {
  const { drawerOpen, setDrawer } = props.drawer;
  const { loadingListening, loadingReading } = props;
  const history = useHistory();
  const classes = useStyles();
  const gt600px = useMediaQuery((theme: any) => theme.breakpoints.up('sm')); // TODO typescript
  useEffect(() => {
    if (!gt600px) {
      setDrawer(false);
    }
  }, [gt600px, setDrawer]);
  const [openRead, setOpenRead] = useState(true);
  const [openListen, setOpenListen] = useState(false);

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
          <MenuListItem
            onClick={() => history.push('/word/new')}
            useBadge
            badgeContent={FAKE_NEW_WORDS}
            loadingBadgeContent={false}
            avatarContent="新"
            text="New Words"
          />
          <MenuListItem
            onClick={() => {
              setOpenRead((prevOpen) => !prevOpen);
            }}
            text="Read"
            avatarContent="读"
            useBadge={!openRead}
            badgeContent={FAKE_READ_DOCUMENTS + FAKE_READ_WORDS}
            loadingBadgeContent={loadingReading}
          />
          <Collapse in={openRead}>
            <MenuListItem
              avatarContent="词"
              useBadge
              tooltip={!drawerOpen}
              text="Words"
              badgeContent={FAKE_READ_WORDS}
              loadingBadgeContent={loadingReading}
              nest
              onClick={() => history.push('/read/word')}
            />
            <MenuListItem
              avatarContent="句"
              useBadge
              tooltip={!drawerOpen}
              text="Sentences"
              badgeContent={FAKE_READ_DOCUMENTS}
              loadingBadgeContent={loadingReading}
              nest
              onClick={() => history.push('/read/sentence')}
            />
          </Collapse>
          <MenuListItem
            onClick={() => {
              setOpenListen((prevOpen) => !prevOpen);
            }}
            text="Listen"
            avatarContent="听"
            useBadge={!openListen}
            badgeContent={undefined}
            loadingBadgeContent={loadingListening}
          />
          <Collapse in={openListen}>
            <MenuListItem
              avatarContent="词"
              useBadge
              tooltip={!drawerOpen}
              text="Words"
              badgeContent={undefined}
              loadingBadgeContent={loadingListening}
              nest
              onClick={() => history.push('/listen/word')}
            />
            <MenuListItem
              avatarContent="句"
              useBadge
              tooltip={!drawerOpen}
              text="Sentences"
              badgeContent={undefined}
              loadingBadgeContent={loadingListening}
              nest
              onClick={() => history.push('/listen/sentence')}
            />
          </Collapse>
          <ListItem onClick={() => history.push('/browse')} button>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={'Browse'} />
          </ListItem>
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
