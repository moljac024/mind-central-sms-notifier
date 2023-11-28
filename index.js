/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';

import {Main as MainApp} from './src/App';
import {name as appName} from './app.json';

export default function Main() {
  return <MainApp />;
}

AppRegistry.registerComponent(appName, () => Main);
