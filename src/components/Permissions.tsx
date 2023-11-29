import * as React from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';

import {Section} from './Section';

import {useStore} from '../modules/store';

export function Permissions() {
  const {state, actions} = useStore();

  if (state.permissions == null) {
    return null;
  }

  if (state.permissions.sms && state.permissions.batteryOptimization) {
    return null;
  }

  return (
    <View>
      <Section title="Power Saving">
        <Text>
          Power saving is{' '}
          {state.permissions.batteryOptimization ? 'enabled' : 'disabled'}
        </Text>
        {!state.permissions.batteryOptimization && (
          <Button
            onPress={async () => {
              actions.openBatteryOptimizationSettings();
            }}>
            Enable power saving
          </Button>
        )}
      </Section>
      <Section title="SMS">
        <Text>
          SMS sending is {state.permissions.sms ? 'enabled' : 'disabled'}
        </Text>
        {!state.permissions.sms && (
          <>
            <Button
              onPress={async () => {
                actions.requestSmsPermissions();
              }}>
              Enable SMS sending
            </Button>
          </>
        )}
      </Section>
    </View>
  );
}
