import {
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Avatar,
  Typography,
} from '@mui/material';
import React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { OptionalTooltip } from './OptionalTooltip';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  badge: {
    color: theme.palette.primary.main,
  },
}));

interface CommonProps {
  onClick: () => void;
  avatarContent: string;
  text: string;
  nest?: boolean;
  tooltip?: boolean;
  avatarColor: string;
}
interface WithoutBadge {
  useBadge: false | undefined;
}
interface WithBadge {
  useBadge: true;
  badgeContent: number | undefined;
  loadingBadgeContent: boolean;
}

type Props = CommonProps & (WithBadge | WithoutBadge);

export const MenuListItem: React.FC<Props> = ({
  onClick,
  avatarContent,
  text,
  avatarColor,
  nest = false,
  tooltip = false,
  ...optional
}) => {
  const classes = useStyles();
  const avatar = (
    <Avatar
      style={{ backgroundColor: avatarColor }}
      className={classes.avatar}
      variant="rounded"
      children={avatarContent}
    />
  );
  let badgeAndAvatar;
  if (optional.useBadge) {
    const { loadingBadgeContent, badgeContent } = optional;
    badgeAndAvatar = (
      <Badge
        max={999}
        showZero
        classes={{ badge: classes.badge }}
        badgeContent={
          loadingBadgeContent ? <CircularProgress size="1rem" /> : badgeContent
        }
      >
        {avatar}
      </Badge>
    );
  } else {
    badgeAndAvatar = avatar;
  }
  return (
    <OptionalTooltip text={text} showTooltip={tooltip}>
      <ListItem
        onClick={onClick}
        className={clsx(nest && classes.nested)}
        button
      >
        <ListItemAvatar>{badgeAndAvatar}</ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ variant: nest ? 'body2' : 'body1' }}
          primary={text}
        />
      </ListItem>
    </OptionalTooltip>
  );
};
