const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');

test('GET /health returns status ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('GET /health returns a numeric, non-negative uptime', async () => {
  const res = await request(app).get('/health');
  assert.equal(typeof res.body.uptime, 'number');
  assert.ok(res.body.uptime >= 0);
});
