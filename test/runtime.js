'use strict';

const path = require('path');
const fsp = require('fs').promises;
const { EventEmitter } = require('events');
const metavm = require('metavm');
const metatests = require('metatests');
const { Model } = require('metaschema');
const { Runtime, parseMarkdown } = require('..');

const loadProcedures = async (targetPath) => {
  const procedures = {};
  const files = await fsp.readdir(targetPath, { withFileTypes: true });
  for (const file of files) {
    if (file.name.startsWith('.') || file.isDirectory()) continue;
    const filePath = path.join(targetPath, file.name);
    const script = await metavm.readScript(filePath);
    procedures[script.name] = script.exports;
  }
  return procedures;
};

const collection = (array) => {
  const hash = {};
  for (const element of array) hash[element.name] = element;
  return hash;
};

metatests.test('Runtime example', async (test) => {
  const model = await Model.load('./test/schemas');
  const procedures = await loadProcedures('./test/store');

  const src = await fsp.readFile('./test/flow/Store.md', 'utf8');
  const processes = collection(parseMarkdown(src));

  const runtime = new Runtime({ processes, procedures, model });
  test.strictSame(runtime instanceof EventEmitter, true);

  runtime.on('notify', (step) => {
    test.strictSame(typeof step, 'string');
  });

  runtime.on('invoke', (data) => {
    test.strictSame(typeof data.procedure, 'string');
  });

  runtime.on('form/show', (step) => {
    test.strictSame(step.constructor.name, 'DomainStep');
    let data = {};
    if (step.command === 'Form `Order`') {
      data = {
        product: 'Motorola Edge 20 Pro',
        carrier: 'Postal service',
        amount: 2,
      };
    }
    if (step.command === 'Form `Payment`') {
      data = {
        amount: 20000,
      };
    }
    runtime.emit('form/submit', data);
  });

  try {
    await runtime.exec('Order product');
  } catch (err) {
    console.log({ err });
    console.log('Process failed');
  }

  test.end();
});

metatests.test('Runtime step prevent mixins', async (test) => {
  const model = await Model.load('./test/schemas');
  const procedures = await loadProcedures('./test/mixins');

  const src = await fsp.readFile('./test/flow/Store.md', 'utf8');
  const processes = collection(parseMarkdown(src));

  const runtime = new Runtime({ processes, procedures, model });

  runtime.on('form/show', (step) => {
    let data = {};
    if (step.command === 'Form `Order`') {
      data = {
        product: 'Motorola Edge 20 Pro',
        carrier: 'Postal service',
        amount: 2,
      };
    }
    if (step.command === 'Form `Payment`') {
      data = {
        amount: 20000,
      };
    }
    runtime.emit('form/submit', data);
  });

  try {
    await runtime.exec('Order product');
  } catch (err) {
    const e = 'Cannot add property mixin, object is not extensible';
    test.strictSame(err.message, e);
    test.strictSame(runtime.context.order.mixin, undefined);
  }

  test.end();
});

metatests.test('Runtime context prevent mixins', async (test) => {
  const model = await Model.load('./test/schemas');
  const procedures = await loadProcedures('./test/store');

  const src = await fsp.readFile('./test/flow/Store.md', 'utf8');
  const processes = collection(parseMarkdown(src));

  const runtime = new Runtime({ processes, procedures, model });

  runtime.on('form/show', (step) => {
    runtime.context.flag = 'mixin';
    let data = {};
    if (step.command === 'Form `Order`') {
      data = {
        product: 'Motorola Edge 20 Pro',
        carrier: 'Postal service',
        amount: 2,
      };
    }
    if (step.command === 'Form `Payment`') {
      data = {
        amount: 20000,
      };
    }
    runtime.emit('form/submit', data);
  });

  try {
    await runtime.exec('Order product');
  } catch (err) {
    const e = 'Cannot add property flag, object is not extensible';
    test.strictSame(err.message, e);
    test.strictSame(runtime.context.flag, undefined);
  }

  test.end();
});
