import {
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Avatar,
} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  nest = false,
  tooltip = false,
  ...optional
}) => {
  const classes = useStyles();

  const avatar = (
    <Avatar
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
        <ListItemText primary={text} />
      </ListItem>
    </OptionalTooltip>
  );
};
