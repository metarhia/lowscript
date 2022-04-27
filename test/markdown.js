'use strict';

const fsp = require('fs').promises;
const metatests = require('metatests');
const lowscript = require('..');

metatests.test('Markdown parsing example', async (test) => {
  const fileName = `./test/examples/Store.md`;
  const src = await fsp.readFile(fileName, 'utf8');
  const bp = lowscript.parseMarkdown(src);
  test.strictSame(bp[0].name, 'Order product');
  test.strictSame(bp[0].body[0].command, 'Form `Order`');
  test.strictSame(bp[0].body[1].fail.length, 1);
  test.strictSame(bp[0].body[3].success.length, 1);
  test.strictSame(bp[0].body[3].finalization.length, 1);
  test.end();
});
