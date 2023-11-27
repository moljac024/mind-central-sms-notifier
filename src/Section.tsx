import * as React from 'react';
import type {PropsWithChildren} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
  },
});

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export function Section({children, title}: SectionProps): JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text variant="headlineSmall">{title}</Text>
      <View style={styles.sectionDescription}>{children}</View>
    </View>
  );
}
