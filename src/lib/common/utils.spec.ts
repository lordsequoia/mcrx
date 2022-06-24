import test from 'ava';

import { asyncABC, double, power } from './utils';

test('getABC', async (t) => {
    t.deepEqual(await asyncABC(), ['a', 'b', 'c']);
  });

test('double', (t) => {
  t.is(double(2), 4);
});

test('power', (t) => {
  t.is(power(2, 4), 16);
});
