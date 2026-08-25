import React, { useState } from 'react';
import { Text } from 'react-native';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { EmptyShelfStateProps } from './EmptyShelfState.types';
import { styles } from './EmptyShelfState.styles';

export const EmptyShelfState: React.FC<EmptyShelfStateProps> = ({
  onAddProduct,
  onSeedDemo,
  style,
}) => {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!onSeedDemo) return;
    setSeeding(true);
    try {
      await onSeedDemo();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <GlowCard variant="cream" padding={20} style={[styles.card, style]}>
      <Text style={styles.emoji}>🧴</Text>
      <Text style={styles.title}>Your shelf is looking a little empty</Text>
      <Text style={styles.description}>
        Add the skincare products you're currently using to track opened dates and daily usage.
      </Text>
      <PillButton
        title="Add my first product"
        onPress={onAddProduct}
        variant="primary"
        size="md"
        style={styles.button}
      />
      {__DEV__ && onSeedDemo && (
        <PillButton
          title="🌱 Load Demo Products (Dev)"
          onPress={handleSeed}
          variant="secondary"
          size="sm"
          loading={seeding}
          style={{ marginTop: 10 }}
        />
      )}
    </GlowCard>
  );
};
