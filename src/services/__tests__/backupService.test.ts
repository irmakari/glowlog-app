import { BACKUP_VERSION, backupService } from '../backupService';

// In-memory stand-in for the SQLite connection: records statements and serves canned tables
const executed: { sql: string; params?: unknown[] }[] = [];
const tables: Record<string, unknown[]> = {};

const fakeDb = {
  getAllAsync: jest.fn(async (sql: string) => tables[sql.replace('SELECT * FROM ', '')] ?? []),
  execAsync: jest.fn(async (sql: string) => {
    executed.push({ sql });
  }),
  runAsync: jest.fn(async (sql: string, params?: unknown[]) => {
    executed.push({ sql, params });
  }),
  withExclusiveTransactionAsync: jest.fn(async (task: (txn: unknown) => Promise<void>): Promise<void> => task(fakeDb)),
};

// Hoisted above the import by ts-jest; fakeDb is only read once getDb() is called
jest.mock('../database/db', () => ({ getDb: async () => fakeDb }));

const inserts = (table: string) =>
  executed.filter((e) => e.sql.trim().startsWith(`INSERT INTO ${table} `)).map((e) => e.params);

const baseBackup = {
  exportedAt: '2026-10-14T10:00:00.000Z',
  products: [
    {
      id: 'p1',
      name: 'Retinol Serum',
      category: 'serum',
      actives: '["retinoid"]',
      archived: 0,
      created_at: 'c',
      updated_at: 'u',
    },
  ],
  routineSteps: [],
  routineLogs: [],
  waterLogs: [],
  productUsageLogs: [],
  settings: [{ key: 'language', value: 'tr' }],
};

describe('backupService', () => {
  beforeEach(() => {
    executed.length = 0;
    Object.keys(tables).forEach((k) => delete tables[k]);
  });

  it('exports treatments and their logs in a version 2 backup', async () => {
    tables.treatments = [{ id: 't1', name: 'Isotretinoin' }];
    tables.treatment_logs = [{ id: 'l1', treatment_id: 't1' }];

    const backup = JSON.parse(await backupService.exportBackup());
    expect(backup.version).toBe(BACKUP_VERSION);
    expect(backup.treatments).toEqual(tables.treatments);
    expect(backup.treatmentLogs).toEqual(tables.treatment_logs);
  });

  it('restores treatments, dose logs and product actives from a version 2 backup', async () => {
    await backupService.importBackup(
      JSON.stringify({
        ...baseBackup,
        version: 2,
        treatments: [
          {
            id: 't1',
            name: 'Isotretinoin',
            kind: 'oral',
            active_key: 'isotretinoin',
            frequency: 'every_other_day',
            weekdays: '[]',
            times: '["20:00"]',
            start_date: '2026-10-01',
            reminder_enabled: 1,
            archived: 0,
            created_at: 'c',
            updated_at: 'u',
          },
        ],
        treatmentLogs: [
          { id: 'l1', treatment_id: 't1', date: '2026-10-13', slot: '20:00', status: 'taken', logged_at: 'x' },
        ],
      })
    );

    expect(inserts('products')[0]).toContain('["retinoid"]');
    expect(inserts('treatments')).toHaveLength(1);
    expect(inserts('treatments')[0]).toEqual(
      expect.arrayContaining(['t1', 'isotretinoin', 'every_other_day', '["20:00"]', '2026-10-01'])
    );
    expect(inserts('treatment_logs')[0]).toEqual(['l1', 't1', '2026-10-13', '20:00', 'taken', 'x']);
  });

  it('still restores a version 1 backup, clearing treatments since the restore replaces everything', async () => {
    const { actives, ...legacyProduct } = baseBackup.products[0];
    await backupService.importBackup(JSON.stringify({ ...baseBackup, version: 1, products: [legacyProduct] }));

    const cleared = executed.map((e) => e.sql);
    expect(cleared).toContain('DELETE FROM treatment_logs;');
    expect(cleared).toContain('DELETE FROM treatments;');
    expect(inserts('treatments')).toHaveLength(0);
    expect(inserts('products')[0]).toContain(null); // no actives in old backups
    expect(inserts('settings')).toEqual([['language', 'tr']]);
  });

  it('rejects a backup whose treatments are not a list', async () => {
    await expect(
      backupService.importBackup(JSON.stringify({ ...baseBackup, version: 2, treatments: 'nope' }))
    ).rejects.toThrow('Invalid backup file structure.');
  });
});
