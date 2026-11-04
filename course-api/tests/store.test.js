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

const LIVE_REF_TODO = 'store returns live references to its internal data';

test(
  'mutating an object from getUser does not change the store',
  { todo: LIVE_REF_TODO },
  () => {
    const user = store.getUser(1);
    user.name = 'Hacked';
    assert.equal(store.getUser(1).name, 'Ada Lovelace');
  }
);

test(
  'mutating an object from listUsers does not change the store',
  { todo: LIVE_REF_TODO },
  () => {
    store.listUsers()[0].name = 'Hacked';
    assert.equal(store.getUser(1).name, 'Ada Lovelace');
  }
);

test(
  'pushing onto the array from listUsers does not change the store',
  { todo: LIVE_REF_TODO },
  () => {
    store.listUsers().push({ id: 99, name: 'Ghost', email: 'g@example.com' });
    assert.equal(store.listUsers().length, 2);
  }
);

test(
  'mutating an object returned by createUser does not change the store',
  { todo: LIVE_REF_TODO },
  () => {
    const user = store.createUser({ name: 'A', email: 'a@example.com' });
    user.name = 'Changed';
    assert.equal(store.getUser(user.id).name, 'A');
  }
);
