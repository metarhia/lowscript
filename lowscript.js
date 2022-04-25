'use strict';

const fsp = require('fs').promises;

const loadFlow = async (fileName) => {
  const buffer = await fsp.readFile(fileName);
  return buffer.toString();
};

const notEmpty = (s) => s.length > 0;

const cutBullet = (s, len = 1) => s.substring(len).trim();

const parseProc = (script) => {
  const pos = script.indexOf('\n');
  const name = script.substring(0, pos);
  const lines = script.substring(pos).trim().split('\n');
  const body = [];
  let step = null;
  for (const line of lines) {
    if (line.startsWith('*')) {
      if (step) body.push(step);
      step = {
        command: cutBullet(line),
        success: [],
        fail: [],
        finalization: [],
      };
    } else {
      const str = line.trim();
      if (str.startsWith('- >')) step.finalization.push(cutBullet(str, 3));
      else if (str.startsWith('-')) step.fail.push(cutBullet(str));
      else if (str.startsWith('+')) step.success.push(cutBullet(str));
    }
  }
  if (step) body.push(step);
  return { name, body };
};

const parseScript = (src) => src.split('# ').filter(notEmpty).map(parseProc);

module.exports = { loadFlow, parseScript };
