import React, { useEffect, useState } from 'react';
import {
  Drawer,
  IconButton,
  Divider,
  List,
  ListSubheader,
  ListItemAvatar,
  Tooltip,
  Typography,
  Avatar,
  CircularProgress,
  Badge,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
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
import {
  FiberNew,
  FilterList,
  Notes,
  ShortText,
  Subject,
} from '@material-ui/icons';

// because I couldn't understand the baloney here: https://material-ui.com/guides/typescript/#usage-of-component-prop
// I didn't end up using the react Router Link (for example, as a component prop to the ListItems), instead I use the useHistory hook hehehe

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
  nested: {
    paddingLeft: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  badgeRoot: {
    color: theme.palette.primary.main,
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
  const [openRead, setOpenRead] = useState(true);
  const [openListen, setOpenListen] = useState(false);
  const tooltipProps = {
    disableFocusListener: drawerOpen,
    disableTouchListener: drawerOpen,
    disableHoverListener: drawerOpen,
  };

  // TODO extract the 4 study list items
  const newWordCount = 10;
  const newWordLoading = false;
  const listenOrphansLoading = false;
  const listenOrphansCount = 24;
  const listenSentenceLoading = false;
  const listenSentenceCount = 301;

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
          <ListItem onClick={() => history.push('/word/new')} button>
            {/* TODO add loading or count here */}
            <ListItemIcon>
              <Badge color="secondary" badgeContent={newWordCount}>
                <FiberNew color="primary"></FiberNew>
              </Badge>
            </ListItemIcon>
            <ListItemText primary={'New Words'} />
          </ListItem>
          <ListItem
            onClick={() => {
              setOpenRead((prevOpen) => !prevOpen);
            }}
            button
          >
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary={'Read'} />
          </ListItem>
          <Collapse in={openRead}>
            <Tooltip title="Words" {...tooltipProps}>
              <ListItem
                className={classes.nested}
                onClick={() => history.push('/read/word')}
                button
              >
                {/* TODO add loading or count here */}
                <ListItemAvatar>
                  <Badge
                    badgeContent={
                      <CircularProgress size="1rem"></CircularProgress>
                    }
                  >
                    <Avatar className={classes.avatar} variant="rounded">
                      词
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={'Words'} />
              </ListItem>
            </Tooltip>
            <Tooltip title="Sentences" {...tooltipProps}>
              <ListItem
                className={classes.nested}
                onClick={() => history.push('/read/sentence')}
                button
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={
                      <CircularProgress size="1rem"></CircularProgress>
                    }
                  >
                    <Avatar className={classes.avatar} variant="rounded">
                      句
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={'Sentences'} />
              </ListItem>
            </Tooltip>
          </Collapse>
          <ListItem onClick={() => setOpenListen(!openListen)} button>
            <ListItemIcon>
              <Badge
                max={999}
                invisible={openListen}
                badgeContent={listenOrphansCount + listenSentenceCount}
              >
                <HearingIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={'Listen'} />
          </ListItem>
          <Collapse in={openListen}>
            <Tooltip title="Words" {...tooltipProps}>
              <ListItem
                className={classes.nested}
                onClick={() => history.push('/listen/word')}
                button
              >
                {/* TODO add loading or count here */}
                <ListItemAvatar>
                  <Badge
                    classes={{ root: classes.badgeRoot }}
                    max={999}
                    badgeContent={listenOrphansCount}
                  >
                    <Avatar className={classes.avatar} variant="rounded">
                      词
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={'Words'} />
              </ListItem>
            </Tooltip>
            <Tooltip title="Sentences" {...tooltipProps}>
              <ListItem
                className={classes.nested}
                onClick={() => history.push('/listen/sentence')}
                button
              >
                <ListItemAvatar>
                  <Badge
                    max={999}
                    color="secondary"
                    badgeContent={listenSentenceCount}
                  >
                    <Avatar className={classes.avatar} variant="rounded">
                      句
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={'Sentences'} />
              </ListItem>
            </Tooltip>
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
