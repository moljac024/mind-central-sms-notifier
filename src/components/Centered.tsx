import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 8,
  },
});

export type CenteredProps = React.PropsWithChildren<{}>;

export function Centered(props: CenteredProps) {
  return <View style={[styles.centered]}>{props.children}</View>;
}
