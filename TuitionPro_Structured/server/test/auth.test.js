import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
test('Unauthenticated callers cannot read student data or upload files', async () => {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, PORT: '5099', JWT_SECRET: 'unit-test-only-secret-string-1234567890' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await Promise.race([
      once(child.stdout, 'data'),
      new Promise((_, reject) => setTimeout(() => reject(Error('API startup timed out')), 5000)),
    ]);
    for (const path of ['/api/state', '/api/materials/1/file']) {
      const r = await fetch('http://localhost:5099' + path);
      assert.equal(r.status, 401);
    }
    let r = await fetch('http://localhost:5099/api/teachers', {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid', 'Content-Type': 'application/json' },
      body: '{}',
    });
    assert.equal(r.status, 401);
    r = await fetch('http://localhost:5099/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid', password: 'pass' }),
    });
    assert.equal(r.status, 400);
  } finally {
    child.kill();
    await once(child, 'exit');
  }
});
