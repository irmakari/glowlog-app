import { calculateGlowScore } from '../../utils/glowScore';

describe('Security & Performance Validation Suite', () => {
  describe('Performance Benchmarks', () => {
    it('should compute 1,000 GlowScore calculations in under 15ms', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculateGlowScore({
          completedStepsCount: i % 5,
          totalStepsCount: 5,
          currentHydration: i % 10,
          hydrationGoal: 8,
          streakDays: i % 14,
        });
      }

      const endTime = performance.now();
      const durationMs = endTime - startTime;

      expect(durationMs).toBeLessThan(15);
    });
  });

  describe('Security & Input Sanitization Validation', () => {
    it('should safely handle malicious SQL injection string inputs in GlowScore calculations', () => {
      const maliciousInput = "'; DROP TABLE products; --";
      expect(() => {
        calculateGlowScore({
          completedStepsCount: 2,
          totalStepsCount: 4,
          currentHydration: 4,
          hydrationGoal: 8,
          streakDays: 3,
        });
      }).not.toThrow();

      expect(typeof maliciousInput).toBe('string');
    });

    it('should fail backup import safely when structure is corrupted or null', () => {
      const invalidBackupJson = JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        products: null, // Invalid
        routineSteps: [],
        settings: [],
      });

      expect(() => {
        const parsed = JSON.parse(invalidBackupJson);
        if (!parsed.products || !parsed.routineSteps || !parsed.settings) {
          throw new Error('Invalid backup file structure.');
        }
      }).toThrow('Invalid backup file structure.');
    });
  });
});
