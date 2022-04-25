'use strict';

const metatests = require('metatests');
const lowscript = require('..');

metatests.test('Lowscript parsing example', async (test) => {
  const filePath = `./test/examples/Order product.md`;
  const src = await lowscript.loadFlow(filePath);
  const script = lowscript.parseScript(src);
  test.strictSame(script[0].name, 'Order product');
  test.strictSame(script[0].body[0].command, 'Form `Order`');
  test.strictSame(script[0].body[1].fail.length, 1);
  test.strictSame(script[0].body[3].success.length, 1);
  test.strictSame(script[0].body[3].finalization.length, 1);
  test.end();
});
