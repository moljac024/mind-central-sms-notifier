import * as React from 'react';
import {View} from 'react-native';
import {Portal, Snackbar} from 'react-native-paper';

import {Screen} from './Screen';
import {Actions} from './Actions';

import {useStore} from '../modules/store';
import {Permissions} from './Permissions';

export function HomeScreen() {
  const {state, actions} = useStore();

  return (
    <Screen>
      <View>
        <Permissions />
        <Actions />

        <Portal>
          <Snackbar
            visible={state.popup != null}
            onDismiss={actions.clearPopup}
            action={{
              label: 'close',
            }}>
            {state.popup}
          </Snackbar>
        </Portal>
      </View>
    </Screen>
  );
}
