/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Button,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useStore} from './store';
import {SMS_NUMBER, SMS_MESSAGE} from './constants';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {state, actions} = useStore();

  React.useEffect(() => {
    let interval = setInterval(() => {
      actions.checkForPermissions();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [actions]);

  if (state.permissions == null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Power Saving">
            <Text>
              Power saving is{' '}
              {state.permissions.batteryOptimization ? 'enabled' : 'disabled'}
            </Text>
            {!state.permissions.batteryOptimization && (
              <Button
                title="Enable power saving"
                onPress={async () => {
                  await actions.openBatteryOptimizationSettings();
                }}
              />
            )}
          </Section>
          <Section title="SMS">
            <Text>
              SMS sending is {state.permissions.sms ? 'enabled' : 'disabled'}
            </Text>
            {!state.permissions.sms && (
              <Button
                title="Enable SMS sending"
                onPress={async () => {
                  actions.requestSmsPermissions();
                }}
              />
            )}
            <Button
              title="Send SMS!"
              onPress={async () => {
                await actions.sendSms(SMS_NUMBER, SMS_MESSAGE);
              }}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
