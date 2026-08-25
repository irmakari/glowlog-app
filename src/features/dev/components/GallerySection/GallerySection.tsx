import React from 'react';
import { View, Text } from 'react-native';
import { GallerySectionProps } from './GallerySection.types';
import { styles } from './GallerySection.styles';

export const GallerySection: React.FC<GallerySectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};
