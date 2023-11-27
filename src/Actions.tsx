import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-paper';

import {useStore} from './store';
import {sendPendingAppointmentReminders} from './tasks';

const styles = StyleSheet.create({
  actions: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export function Actions() {
  const {state} = useStore();

  if (state.permissions == null) {
    return null;
  }

  if (state.permissions.sms === false) {
    return null;
  }

  return (
    <View style={styles.actions}>
      <Button
        mode="contained"
        onPress={async () => {
          const controller = new AbortController();
          const signal = controller.signal;

          setTimeout(() => controller.abort(), 30000);

          try {
            await sendPendingAppointmentReminders({
              signal,
            });
          } catch (e) {
            console.log(e);
            // TODO: Handle error
          }
        }}>
        Send SMS reminders
      </Button>
    </View>
  );
}
