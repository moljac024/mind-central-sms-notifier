import * as React from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconProps = {
  color: string;
  size?: number;
  focused?: boolean;
};

export function Home(props: IconProps) {
  const {color, size = 26} = props;

  return <MaterialCommunityIcons name="home" color={color} size={size} />;
}

export function Settings(props: IconProps) {
  const {color, size = 26} = props;

  return <MaterialCommunityIcons name="cog" color={color} size={size} />;
}
