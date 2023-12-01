import * as React from 'react';
import {Appbar, useTheme} from 'react-native-paper';

import {DevHelper} from './DevHelper';

export function Header() {
  const theme = useTheme();

  return (
    <Appbar.Header
      theme={{
        colors: {
          primary: theme?.colors.surface,
        },
      }}>
      <Appbar.Content title="MindCentral SMS" />

      <DevHelper />
    </Appbar.Header>
  );
}
