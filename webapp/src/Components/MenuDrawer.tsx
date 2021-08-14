import React, { useEffect, useState } from 'react';
import {
  Drawer,
  IconButton,
  Divider,
  List,
  ListSubheader,
  useTheme,
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
import { useDocuments } from '../Hooks/documents';
import { StudyType } from '../schema/generated';
import { useWords } from '../Hooks/words';

// Fake data waiting on real integration
const FAKE_NEW_WORDS = 10;

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

  const toReadDocsCount = useDocuments(StudyType.Read).countRemaining;
  const toReadWordsCount = useWords(StudyType.Read).countRemaining;

  const toListenDocsCount = useDocuments(StudyType.Listen).countRemaining;
  const toListenWordsCount = useWords(StudyType.Listen).countRemaining;

  useEffect(() => {
    if (!gt600px) {
      setDrawer(false);
    }
  }, [gt600px, setDrawer]);
  const [openRead, setOpenRead] = useState(true);
  const [openListen, setOpenListen] = useState(false);
  const theme = useTheme();
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
            avatarColor={theme.palette.success.main}
            onClick={() => history.push('/word/new')}
            useBadge
            badgeContent={FAKE_NEW_WORDS}
            loadingBadgeContent={false}
            avatarContent="新"
            text="New Words"
          />
          <MenuListItem
            avatarColor={theme.palette.info.main}
            onClick={() => {
              setOpenRead((prevOpen) => !prevOpen);
            }}
            text="Read"
            avatarContent="读"
            useBadge={!openRead}
            badgeContent={toReadDocsCount + toReadWordsCount}
            loadingBadgeContent={loadingReading}
          />
          <Collapse in={openRead}>
            <MenuListItem
              avatarColor={theme.palette.info.light}
              avatarContent="词"
              useBadge
              tooltip={!drawerOpen}
              text="Words"
              badgeContent={toReadWordsCount}
              loadingBadgeContent={loadingReading}
              nest
              onClick={() => history.push('/read/word')}
            />
            <MenuListItem
              avatarColor={theme.palette.info.light}
              avatarContent="句"
              useBadge
              tooltip={!drawerOpen}
              text="Sentences"
              badgeContent={toReadDocsCount}
              loadingBadgeContent={loadingReading}
              nest
              onClick={() => history.push('/read/sentence')}
            />
          </Collapse>
          <MenuListItem
            avatarColor={theme.palette.secondary.main}
            onClick={() => {
              setOpenListen((prevOpen) => !prevOpen);
            }}
            text="Listen"
            avatarContent="听"
            useBadge={!openListen}
            badgeContent={toListenDocsCount + toListenWordsCount}
            loadingBadgeContent={loadingListening}
          />
          <Collapse in={openListen}>
            <MenuListItem
              avatarColor={theme.palette.secondary.light}
              avatarContent="词"
              useBadge
              tooltip={!drawerOpen}
              text="Words"
              badgeContent={toListenWordsCount}
              loadingBadgeContent={loadingListening}
              nest
              onClick={() => history.push('/listen/word')}
            />
            <MenuListItem
              avatarColor={theme.palette.secondary.light}
              avatarContent="句"
              useBadge
              tooltip={!drawerOpen}
              text="Sentences"
              badgeContent={toListenDocsCount}
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
