/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

const SMS_NUMBER = '+381640930989';

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

import {
  Colors,
  // DebugInstructions,
  // Header,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {SmsModule} from './sms';
import {PowerModule} from './power';

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
  const [powerSavingEnabled, setPowerSavingEnabled] = React.useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function checkBatteryOpt() {
    const isEnabled = await PowerModule.isBatteryOptEnabled();
    setPowerSavingEnabled(isEnabled);
  }

  React.useEffect(() => {
    checkBatteryOpt();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
            <Text>Jebo bi te Bebo!!!</Text>
          </Section>
          <Section title="Power Saving">
            <Text>
              Power saving is {powerSavingEnabled ? 'enabled' : 'disabled'}
            </Text>
            <Button
              title="Enable power saving"
              onPress={async () => {
                await PowerModule.openBatteryOptimizationSettings();
                await checkBatteryOpt();
              }}
            />
          </Section>
          <Section title="SMS">
            <Button
              title="Send SMS!"
              onPress={async () => {
                const result = await SmsModule.sendSms(
                  SMS_NUMBER,
                  'testing 123',
                );
                console.log('sms send result: ', result);
              }}
            />
          </Section>
          {/* <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section> */}
          {/* <LearnMoreLinks /> */}
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
