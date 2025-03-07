import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type TypographyProps = TextProps & {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  style?: TextStyle;
  children: React.ReactNode;
};

const Typography: React.FC<TypographyProps> = ({ variant = 'body', style, children, ...props }) => {
  const baseStyles: Record<TypographyProps['variant'], TextStyle> = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 12, color: 'gray' },
  };

  return <Text style={[baseStyles[variant], style]} {...props}>{children}</Text>;
};

export default Typography;
