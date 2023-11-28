import * as React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Appbar, Portal, Snackbar, Switch, useTheme} from 'react-native-paper';
// import {useNavigation} from '@react-navigation/native';

import {useStore} from '../modules/store';
import {Permissions} from './Permissions';
import {Actions} from './Actions';
import {usePreferences} from './PreferencesContext';

export function HomeScreen() {
  const {state, actions} = useStore();

  const theme = useTheme();
  const {toggleTheme, isThemeDark} = usePreferences();

  // const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Appbar.Header
        theme={{
          colors: {
            primary: theme?.colors.surface,
          },
        }}>
        <Appbar.Content title="MindCentral SMS" />
        <Switch color={'red'} value={isThemeDark} onValueChange={toggleTheme} />
      </Appbar.Header>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
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
              Sent SMS messages succesfully.
            </Snackbar>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
