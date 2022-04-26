'use strict';

const fsp = require('fs').promises;
const metatests = require('metatests');
const lowscript = require('..');

metatests.test('Lowscript parsing example', async (test) => {
  const fileName = `./test/examples/Order product.md`;
  const src = await fsp.readFile(fileName, 'utf8');
  const bp = lowscript.parseProcess(src);
  test.strictSame(bp[0].name, 'Order product');
  test.strictSame(bp[0].body[0].command, 'Form `Order`');
  test.strictSame(bp[0].body[1].fail.length, 1);
  test.strictSame(bp[0].body[3].success.length, 1);
  test.strictSame(bp[0].body[3].finalization.length, 1);
  test.end();
});
