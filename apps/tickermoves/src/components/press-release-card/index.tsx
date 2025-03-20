import React from 'react';
import { Linking, View } from 'react-native';
import { Analysis } from '../../constants';
import { Colors } from '../../styles';
import Typography from '../typography';
import styles from './styles';

import type { PressRelease } from '@tickermoves/shared-types';

interface Props {
  item: PressRelease
}

export default function PressReleaseCard({ item }: Props) {
  const openLink = () => Linking.openURL(item.url);

  const generateTickerLabel = () =>
    item.tickers.split(',').map(t => `#${t} `).join('');
  const tickers = generateTickerLabel();

  const getBorderColor = () => {
    let color;
    switch (item.analysis) {
      case Analysis.MOST_LIKELY:
        color = Colors.mostLikely;
        break;
      case Analysis.LIKELY:
        color = Colors.likely;
        break;
      case Analysis.UNSURE:
        color = Colors.unsure;
        break;
      case Analysis.UNLIKELY:
        color = Colors.unlikely;
        break;
      default:
        color = Colors.black;
        break;
    }
    return color;
  };
  const borderColor = getBorderColor();

  return (
    <View style={[styles.component, { borderColor }]}>
      <View style={styles.header}>
        <Typography variant="body" style={styles.tickers}>{tickers}</Typography>
        <Typography variant="h1" style={styles.link} onPress={openLink}>⇢</Typography>
      </View>
      <Typography variant="h2">{item.title}</Typography>
      <Typography variant="body">{item.analysisReasoning}</Typography>
    </View>
  );
}
