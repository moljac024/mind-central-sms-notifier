import * as React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

import {Appbar, Text, Portal, Snackbar} from 'react-native-paper';

import {useStore} from './store';
import {initBackgroundTask} from './tasks';
import {Permissions} from './Permissions';
import {Actions} from './Actions';

function App(): JSX.Element {
  const {state, actions} = useStore();

  React.useEffect(() => {
    let interval = setInterval(() => {
      actions.checkForPermissions();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [actions]);

  React.useEffect(() => {
    initBackgroundTask();
  }, []);

  if (state.permissions == null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content title="MindCentral SMS" />
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

export default App;
