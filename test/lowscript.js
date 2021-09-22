'use strict';

const metatests = require('metatests');
const lowscript = require('..');

metatests.test('Stub', async (test) => {
  test.strictSame(lowscript, {});
  test.end();
});
