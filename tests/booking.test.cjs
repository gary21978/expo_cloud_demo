const { test } = require('node:test');
const assert = require('node:assert/strict');
const { changeNights, totalPrice, createBooking, cancelBooking } = require('../build/tests/booking.js');

test('one and three nights have the expected prices', () => {
  assert.equal(totalPrice(1), 399);
  assert.equal(totalPrice(3), 1197);
});
test('nights stay within one to seven', () => {
  assert.equal(changeNights(1, -1), 1);
  assert.equal(changeNights(7, 1), 7);
  assert.equal(changeNights(2, 1), 3);
  assert.equal(changeNights(3, -1), 2);
});
test('invalid pricing input fails', () => {
  for (const n of [0, 8, 1.5, NaN]) assert.throws(() => totalPrice(n));
});
test('invalid night changes fail', () => {
  assert.throws(() => changeNights(1.5, 1));
  assert.throws(() => changeNights(1, 0.5));
});
test('booking snapshots the total and nights', () => {
  assert.deepEqual(createBooking(3), {id:'DEMO-001',nights:3,total:1197,status:'confirmed'});
});
test('cancellation preserves the original order and its amount', () => {
  const original = createBooking(2);
  const cancelled = cancelBooking(original);
  assert.equal(original.status, 'confirmed');
  assert.deepEqual(cancelled, {...original, status:'cancelled'});
});
test('cancelling an already cancelled booking is idempotent', () => {
  const cancelled = cancelBooking(createBooking(1));
  assert.deepEqual(cancelBooking(cancelled), cancelled);
});
