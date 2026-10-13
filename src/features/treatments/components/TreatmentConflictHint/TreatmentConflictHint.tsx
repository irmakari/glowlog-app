import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { useTranslation } from '../../../../hooks/useTranslation';
import { productService } from '../../../products/services/productService';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { treatmentService } from '../../services/treatmentService';
import { findTreatmentConflicts, TreatmentConflict } from '../../utils/treatmentConflicts';
import { isTreatmentActiveOn } from '../../utils/treatmentSchedule.utils';
import { conflictMessage, conflictTitle } from '../TreatmentConflictNotice';

/** Inline warning under a product picker when the chosen product clashes with a running treatment */
export const TreatmentConflictHint: React.FC<{ productId?: string }> = ({ productId }) => {
  const { t } = useTranslation();
  // Keyed by product so a stale result never shows for a newly picked product
  const [result, setResult] = useState<{ productId: string; conflicts: TreatmentConflict[] } | null>(null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    (async () => {
      try {
        const today = getLocalDateString();
        const [treatments, product] = await Promise.all([
          treatmentService.getTreatments(),
          productService.getProductById(productId),
        ]);
        if (cancelled) return;
        const running = treatments.filter((tr) => isTreatmentActiveOn(tr, today));
        setResult({ productId, conflicts: product ? findTreatmentConflicts(running, [product]) : [] });
      } catch (err) {
        console.error('Failed to check product against treatments:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const conflicts = result && result.productId === productId ? result.conflicts : [];
  if (conflicts.length === 0) return null;

  return (
    <View style={styles.container}>
      {conflicts.map((conflict) => (
        <View key={conflict.treatment.id} style={styles.item}>
          <Ionicons name="warning" size={14} color={Colors.text} style={styles.icon} />
          <Text style={styles.text}>
            <Text style={styles.bold}>{conflictTitle(conflict, t)}: </Text>
            {conflictMessage(conflict, t)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(240, 214, 108, 0.45)',
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    ...Typography.caption,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.text,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
});
