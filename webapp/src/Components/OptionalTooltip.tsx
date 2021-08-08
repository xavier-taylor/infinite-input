import { Tooltip } from '@material-ui/core';
import React, { ReactElement } from 'react';

interface Props {
  text: string;
  showTooltip: boolean;
  children: ReactElement;
}
export const OptionalTooltip: React.FC<Props> = ({
  text,
  showTooltip,
  children,
}) => {
  if (showTooltip) {
    return <Tooltip title={text}>{children}</Tooltip>;
  } else {
    return <>{children}</>;
  }
};
