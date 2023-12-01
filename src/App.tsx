import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';

import * as Icons from './components/Icons';
import {HomeScreen} from './components/HomeScreen';
import {SettingsScreen} from './components/SettingsScreen';
import {LoadingScreen} from './components/Loader';

import {CombinedDefaultTheme, CombinedDarkTheme} from './modules/themes';
import {PreferencesContext} from './components/PreferencesContext';

import {DB} from './modules/db';
import {useStore} from './modules/store';
import {PreferencesService} from './modules/preferences';
import {AppointmentService} from './modules/appointments';

// const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: Icons.Home,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: Icons.Settings,
        }}
      />
    </Tab.Navigator>
  );
}

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
    AppointmentService.initRemindersBackgroundTask();

    return () => {
      // Close the database when app is closed
      DB.closeDatabase();
    };
  }, []);

  if (state.permissions == null || state.version == null) {
    return <LoadingScreen />;
  }

  return <MainTabs />;
}

function AppContainer() {
  const [isThemeDark, setIsThemeDark] = React.useState(
    PreferencesService.getPreferences().isDarkMode,
  );
  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    const newValue = !isThemeDark;
    setIsThemeDark(newValue);
    PreferencesService.setPreferences({
      isDarkMode: newValue,
    });
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <App />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}

export function Main() {
  const {state, actions} = useStore();

  React.useEffect(() => {
    actions.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.initialized === false) {
    return <LoadingScreen />;
  }

  return <AppContainer />;
}
