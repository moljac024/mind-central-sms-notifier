import * as React from 'react';
import type {PropsWithChildren} from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Header} from './Header';

export type ScreenProps = PropsWithChildren<{includeHeader?: boolean}>;

export function Screen(props: ScreenProps) {
  const {includeHeader = true} = props;

  return (
    <SafeAreaView>
      {includeHeader && <Header />}

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
}
