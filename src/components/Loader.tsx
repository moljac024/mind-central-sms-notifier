import * as React from 'react';
import {ActivityIndicator} from 'react-native-paper';

import {Centered} from './Centered';

export function LoadingScreen() {
  return (
    <Centered>
      <ActivityIndicator animating={true} size={64} />
    </Centered>
  );
}
