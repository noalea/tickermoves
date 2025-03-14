import React from 'react';
import { useColorScheme, View } from 'react-native';
import styles from './styles';
import { Colors } from '../../styles';

export default function ModalNotch() {
  const theme = useColorScheme() || 'light';
  const isDark = theme === 'dark';
  return <View style={[styles.component, { backgroundColor: isDark ? Colors.grey11 : Colors.grey3 }]} />;
}
