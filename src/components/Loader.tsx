import * as React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

export function LoadingScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Loading</Text>
    </View>
  );
}
