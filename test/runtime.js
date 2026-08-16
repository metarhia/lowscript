'use strict';

const path = require('path');
const fsp = require('fs').promises;
const { EventEmitter } = require('events');
const metavm = require('metavm');
const metatests = require('metatests');
const { loadModel } = require('metaschema');
const { Runtime, parseMarkdown } = require('..');

const loadProcedures = async (targetPath) => {
  const procedures = {};
  const files = await fsp.readdir(targetPath, {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.name.startsWith('.') || file.isDirectory()) {
      continue;
    }
    const filePath = path.join(targetPath, file.name);
    const script = await metavm.readScript(filePath);
    procedures[script.name] = script.exports;
  }
  return procedures;
};

const collection = (array) => {
  const hash = {};
  for (const element of array) {
    hash[element.name] = element;
  }
  return hash;
};

const formDataFor = (command) => {
  if (command === 'Form `Order`') {
    return {
      product: 'Motorola Edge 20 Pro',
      carrier: 'Postal service',
      amount: 2,
    };
  }
  if (command === 'Form `Payment`') {
    return { amount: 20000 };
  }
  return {};
};

const createRuntime = async (proceduresPath) => {
  const model = await loadModel('./test/schemas');
  const procedures = await loadProcedures(proceduresPath);
  const src = await fsp.readFile('./test/flow/Store.md', 'utf8');
  const processes = collection(parseMarkdown(src));
  return new Runtime({ processes, procedures, model });
};

const attachFormSubmit = (runtime) => {
  runtime.on('form/show', (step) => {
    const data = formDataFor(step.command);
    runtime.emit('form/submit', data);
  });
};

metatests.test('Runtime example', async (test) => {
  const runtime = await createRuntime('./test/store');
  test.strictSame(runtime instanceof EventEmitter, true);

  runtime.on('notify', (step) => {
    test.strictSame(typeof step, 'string');
  });

  runtime.on('invoke', (data) => {
    test.strictSame(typeof data.procedure, 'string');
  });

  attachFormSubmit(runtime);

  try {
    await runtime.exec('Order product');
  } catch (err) {
    console.log({ err });
    console.log('Process failed');
  }

  test.end();
});

metatests.test('Runtime step prevent mixins', async (test) => {
  const runtime = await createRuntime('./test/mixins');
  attachFormSubmit(runtime);

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
  const runtime = await createRuntime('./test/store');

  runtime.on('form/show', (step) => {
    runtime.context.flag = 'mixin';
    const data = formDataFor(step.command);
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
