import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDb } from '../../../../services/database/db';
import { DbInspectorProps } from './DbInspector.types';
import { styles } from './DbInspector.styles';
import { Colors } from '../../../../constants/colors';

type TableName =
  | 'products'
  | 'routine_steps'
  | 'routine_logs'
  | 'water_logs'
  | 'product_usage_logs'
  | 'settings';

const TABLES: TableName[] = [
  'products',
  'routine_steps',
  'routine_logs',
  'water_logs',
  'product_usage_logs',
  'settings',
];

export const DbInspector: React.FC<DbInspectorProps> = () => {
  const [activeTable, setActiveTable] = useState<TableName>('products');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTableRows = useCallback(async (tableName: TableName) => {
    try {
      setLoading(true);
      const db = await getDb();
      const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
      setRows(result || []);
    } catch (err) {
      console.error(`Failed to inspect table ${tableName}:`, err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTableRows(activeTable);
  }, [activeTable, fetchTableRows]);

  return (
    <View style={styles.container}>
      {/* Table Selector Tabs */}
      <View style={styles.tabRow}>
        {TABLES.map((t) => {
          const isActive = activeTable === t;
          return (
            <TouchableOpacity
              key={t}
              activeOpacity={0.8}
              onPress={() => setActiveTable(t)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Table Header & Refresh */}
      <View style={styles.headerRow}>
        <Text style={styles.tableTitle}>
          Table: {activeTable} ({rows.length} rows)
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => fetchTableRows(activeTable)}
        >
          <Ionicons name="refresh" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* JSON Viewer */}
      {loading ? (
        <ActivityIndicator size="small" color={Colors.text} style={{ marginVertical: 10 }} />
      ) : rows.length === 0 ? (
        <Text style={styles.emptyText}>No rows in table '{activeTable}'.</Text>
      ) : (
        <ScrollView style={styles.jsonContainer} nestedScrollEnabled>
          <Text style={styles.jsonText}>{JSON.stringify(rows, null, 2)}</Text>
        </ScrollView>
      )}
    </View>
  );
};
