'use strict';

const fsp = require('fs').promises;

const loadFlow = (fileName) => fsp.readFile(fileName, { encoding: 'utf8' });

const notEmpty = (s) => s.length > 0;

const cutBullet = (s, len = 1) => s.substring(len).trim();

const steps = [
  /* step , prefix */
  ['command', '*'],
  ['finalization', '- >'],
  ['fail', '-'],
  ['success', '+'],
  // new steps can be added here
];

const parseLine = (line) => {
  const str = line.trim();
  const [step, prefix] = steps.find((cond) => str.startsWith(cond[1]));
  return { step, parsed: cutBullet(str, prefix.length) };
};

const parseProc = (script) => {
  const pos = script.indexOf('\n');
  const name = script.substring(0, pos);
  const lines = script.substring(pos).trim().split('\n');
  const body = [];
  for (const line of lines) {
    const { step, parsed } = parseLine(line);
    if (step === 'command') {
      body.push({
        command: parsed,
        success: [],
        fail: [],
        finalization: [],
      });
    } else {
      const last = body[body.length - 1];
      last[step].push(parsed);
    }
  }
  return { name, body };
};

const parseScript = (src) => src.split('# ').filter(notEmpty).map(parseProc);

module.exports = { loadFlow, parseScript };
