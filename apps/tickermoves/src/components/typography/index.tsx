import React from 'react';
import { Text, TextProps, TextStyle, useColorScheme } from 'react-native';
import { baseStyles, styles } from './styles';

export type TypographyProps = TextProps & {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  style?: TextStyle;
  children: React.ReactNode;
};

const Typography: React.FC<TypographyProps> = ({ variant = 'body', style, children, ...props }) => {
  const theme = useColorScheme() || 'light';

  return <Text style={[baseStyles[variant], styles[theme], style]} {...props}>{children}</Text>;
};

export default Typography;
