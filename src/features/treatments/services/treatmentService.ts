import { getDb } from '../../../services/database/db';
import {
  CreateTreatmentInput,
  Treatment,
  TreatmentActive,
  TreatmentDoseStatus,
  TreatmentFrequency,
  TreatmentKind,
  TreatmentLog,
  UpdateTreatmentInput,
} from '../types/treatment.types';
import { normalizeTimes } from '../utils/treatmentSchedule.utils';

interface TreatmentRow {
  id: string;
  name: string;
  kind: string;
  active_key: string;
  dose_note: string | null;
  frequency: string;
  weekdays: string;
  times: string;
  start_date: string;
  end_date: string | null;
  reminder_enabled: number;
  archived: number;
  created_at: string;
  updated_at: string;
}

interface TreatmentLogRow {
  id: string;
  treatment_id: string;
  date: string;
  slot: string;
  status: string;
  logged_at: string;
}

const parseJsonArray = <T>(value: string | null): T[] => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function mapRowToTreatment(row: TreatmentRow): Treatment {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind as TreatmentKind,
    activeKey: row.active_key as TreatmentActive,
    doseNote: row.dose_note ?? undefined,
    frequency: row.frequency as TreatmentFrequency,
    weekdays: parseJsonArray<number>(row.weekdays),
    times: parseJsonArray<string>(row.times),
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    reminderEnabled: Boolean(row.reminder_enabled),
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToLog(row: TreatmentLogRow): TreatmentLog {
  return {
    id: row.id,
    treatmentId: row.treatment_id,
    date: row.date,
    slot: row.slot,
    status: row.status as TreatmentDoseStatus,
    loggedAt: row.logged_at,
  };
}

export const treatmentService = {
  /**
   * All treatments, newest first. Archived ones are included only when asked for.
   */
  async getTreatments(includeArchived = false): Promise<Treatment[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<TreatmentRow>(
      `SELECT * FROM treatments ${includeArchived ? '' : 'WHERE archived = 0'} ORDER BY created_at DESC`
    );
    return rows.map(mapRowToTreatment);
  },

  async getTreatmentById(id: string): Promise<Treatment | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<TreatmentRow>('SELECT * FROM treatments WHERE id = ?', [id]);
    return row ? mapRowToTreatment(row) : null;
  },

  async createTreatment(input: CreateTreatmentInput): Promise<Treatment> {
    const db = await getDb();
    const now = new Date().toISOString();
    const id = `treat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await db.runAsync(
      `INSERT INTO treatments (id, name, kind, active_key, dose_note, frequency, weekdays, times, start_date, end_date, reminder_enabled, archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        input.name,
        input.kind,
        input.activeKey,
        input.doseNote || null,
        input.frequency,
        JSON.stringify([...input.weekdays].sort((a, b) => a - b)),
        JSON.stringify(normalizeTimes(input.times)),
        input.startDate,
        input.endDate || null,
        input.reminderEnabled ? 1 : 0,
        now,
        now,
      ]
    );

    const created = await this.getTreatmentById(id);
    if (!created) throw new Error('Failed to retrieve newly created treatment');
    return created;
  },

  async updateTreatment(id: string, input: UpdateTreatmentInput): Promise<Treatment> {
    const db = await getDb();
    const existing = await this.getTreatmentById(id);
    if (!existing) throw new Error(`Treatment not found: ${id}`);

    // Optional fields: a present key with an empty value clears the field
    const next: Treatment = {
      ...existing,
      ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)),
      doseNote: 'doseNote' in input ? input.doseNote || undefined : existing.doseNote,
      endDate: 'endDate' in input ? input.endDate || undefined : existing.endDate,
    };
    const times = normalizeTimes(next.times);

    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.runAsync(
        `UPDATE treatments
         SET name = ?, kind = ?, active_key = ?, dose_note = ?, frequency = ?, weekdays = ?, times = ?,
             start_date = ?, end_date = ?, reminder_enabled = ?, archived = ?, updated_at = ?
         WHERE id = ?`,
        [
          next.name,
          next.kind,
          next.activeKey,
          next.doseNote || null,
          next.frequency,
          JSON.stringify([...next.weekdays].sort((a, b) => a - b)),
          JSON.stringify(times),
          next.startDate,
          next.endDate || null,
          next.reminderEnabled ? 1 : 0,
          next.archived ? 1 : 0,
          new Date().toISOString(),
          id,
        ]
      );

      // A removed dose time takes its unanswered future logs with it; past history stays
      const removedSlots = existing.times.filter((slot) => !times.includes(slot));
      for (const slot of removedSlots) {
        await txn.runAsync(
          `DELETE FROM treatment_logs WHERE treatment_id = ? AND slot = ? AND date > date('now', 'localtime')`,
          [id, slot]
        );
      }
    });

    const updated = await this.getTreatmentById(id);
    if (!updated) throw new Error('Failed to retrieve updated treatment');
    return updated;
  },

  async setArchived(id: string, archived: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync(`UPDATE treatments SET archived = ?, updated_at = ? WHERE id = ?`, [
      archived ? 1 : 0,
      new Date().toISOString(),
      id,
    ]);
  },

  /** Deletes the treatment and its dose history */
  async deleteTreatment(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM treatments WHERE id = ?', [id]);
  },

  async getLogsForDate(dateKey: string): Promise<TreatmentLog[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<TreatmentLogRow>('SELECT * FROM treatment_logs WHERE date = ?', [dateKey]);
    return rows.map(mapRowToLog);
  },

  /**
   * Records a dose as taken or skipped. `null` clears the record (back to "not answered").
   */
  async setDoseStatus(
    treatmentId: string,
    dateKey: string,
    slot: string,
    status: TreatmentDoseStatus | null
  ): Promise<void> {
    const db = await getDb();

    if (status === null) {
      await db.runAsync('DELETE FROM treatment_logs WHERE treatment_id = ? AND date = ? AND slot = ?', [
        treatmentId,
        dateKey,
        slot,
      ]);
      return;
    }

    const id = `tlog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await db.runAsync(
      `INSERT INTO treatment_logs (id, treatment_id, date, slot, status, logged_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(treatment_id, date, slot) DO UPDATE SET status = excluded.status, logged_at = excluded.logged_at`,
      [id, treatmentId, dateKey, slot, status, new Date().toISOString()]
    );
  },
};
