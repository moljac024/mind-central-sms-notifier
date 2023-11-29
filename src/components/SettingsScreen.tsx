import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Switch, Text, Card} from 'react-native-paper';
import {usePreferences} from './PreferencesContext';

import {Screen} from './Screen';
import {Centered} from './Centered';

import {useStore} from '../modules/store';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 8,
  },
  cardContent: {
    marginVertical: 8,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export function SettingsScreen() {
  const {state} = useStore();
  const {toggleTheme, isThemeDark} = usePreferences();

  return (
    <Screen>
      <Centered>
        <Card style={[styles.card]}>
          <Card.Content style={[styles.cardContent]}>
            <Text>Dark mode</Text>

            <Switch
              color={'red'}
              value={isThemeDark}
              onValueChange={toggleTheme}
            />
          </Card.Content>
        </Card>

        {state.version && (
          <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>
              <Text>Version</Text>

              <Text>{state.version.versionName}</Text>
            </Card.Content>
          </Card>
        )}
      </Centered>
    </Screen>
  );
}
