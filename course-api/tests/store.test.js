const test = require('node:test');
const assert = require('node:assert');
const store = require('../db/store');

test.beforeEach(() => store.reset());

test('listUsers returns the seeded users', () => {
  const users = store.listUsers();
  assert.equal(users.length, 2);
  assert.equal(users[0].name, 'Ada Lovelace');
});

test('getUser returns undefined for a missing id', () => {
  assert.equal(store.getUser(999), undefined);
});

test('createUser assigns incrementing ids and stores the user', () => {
  const a = store.createUser({ name: 'A', email: 'a@example.com' });
  const b = store.createUser({ name: 'B', email: 'b@example.com' });
  assert.equal(a.id, 3);
  assert.equal(b.id, 4);
  assert.equal(store.listUsers().length, 4);
});

test('updateUser returns undefined for a missing id', () => {
  assert.equal(store.updateUser(999, { name: 'X' }), undefined);
});

test('updateUser only changes the provided fields', () => {
  const user = store.updateUser(1, { email: 'new@example.com' });
  assert.equal(user.email, 'new@example.com');
  assert.equal(user.name, 'Ada Lovelace');
});

test('reset restores the seed data', () => {
  store.createUser({ name: 'A', email: 'a@example.com' });
  store.reset();
  assert.equal(store.listUsers().length, 2);
  const next = store.createUser({ name: 'B', email: 'b@example.com' });
  assert.equal(next.id, 3);
});
