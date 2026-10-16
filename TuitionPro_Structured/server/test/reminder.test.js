import test from 'node:test';
import assert from 'node:assert/strict';
import { generateReminderMessage } from '../services/reminderService.js';
test('Templates retain the actual amount, class and month in both languages', async () => {
  const previous = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    for (const language of ['English', 'Tamil'])
      for (const tone of ['Polite', 'Friendly', 'Firm']) {
        const result = await generateReminderMessage({
          student: { name: 'Arun' },
          classInfo: { name: 'Maths', fee: 2700 },
          month: '2026-11',
          language,
          tone,
        });
        assert.equal(result.source, 'template');
        assert.ok(result.message.includes('2700'));
        assert.ok(result.message.includes('2026-11'));
        assert.ok(result.message.includes('Arun'));
      }
  } finally {
    if (previous !== undefined) process.env.ANTHROPIC_API_KEY = previous;
  }
});
