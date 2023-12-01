import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';

import {useStore} from '../modules/store';
import {DB} from '../modules/db';

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: 24,
  },
  button: {
    marginBottom: 8,
  },
});

export function DevActions() {
  if (__DEV__ === false) {
    return null;
  }

  return (
    <>
      <Button
        style={styles.button}
        mode="contained"
        onPress={async () => {
          DB.getDatabaseVersion();
        }}>
        Get db version
      </Button>

      <Button
        style={styles.button}
        mode="contained"
        onPress={async () => {
          DB.initializeDatabase();
        }}>
        Run migrations
      </Button>

      <Button
        style={styles.button}
        mode="contained"
        onPress={async () => {
          DB.resetDatabaseForDevelopment();
        }}>
        Reset database
      </Button>
    </>
  );
}

export function Actions() {
  const {state, actions} = useStore();

  if (state.permissions == null) {
    return null;
  }

  if (state.permissions.sms === false) {
    return null;
  }

  return (
    <View style={styles.actions}>
      <Button
        style={styles.button}
        mode="contained"
        loading={state.inProgress}
        disabled={state.inProgress}
        onPress={async () => {
          const controller = new AbortController();
          const signal = controller.signal;

          setTimeout(() => controller.abort(), 30000);

          try {
            await actions.sendPendingAppointmentReminders({
              signal,
            });
          } catch (e) {
            console.log(e);
            // TODO: Handle error
          }
        }}>
        Send SMS reminders
      </Button>

      <DevActions />
    </View>
  );
}
