'use strict';

const notEmpty = (s) => s.length > 0;

const cutString = (s, len = 1) => s.substring(len).trim();

class DomainStep {
  constructor(command) {
    this.command = command;
    this.success = [];
    this.fail = [];
    this.finalization = [];
  }
}

class DomainProcess {
  constructor(name) {
    this.name = name;
    this.body = [];
  }
}

const BULLETS = [
  ['* `+`', 'success'],
  ['* `-`', 'fail'],
  ['* `<`', 'finalization'],
  ['*', 'command'],
];

const parseLine = (line) => {
  const str = line.trim();
  const [bullet, type] = BULLETS.find(([bullet]) => str.startsWith(bullet));
  return { type, text: cutString(str, bullet.length) };
};

const last = (array) => array[array.length - 1];

const parseProc = (src) => {
  const pos = src.indexOf('\n');
  const name = src.substring(0, pos);
  const proc = new DomainProcess(name);
  const lines = cutString(src, pos).split('\n');
  for (const line of lines) {
    const { type, text } = parseLine(line);
    if (type === 'command') {
      proc.body.push(new DomainStep(text));
    } else {
      last(proc.body)[type].push(text);
    }
  }
  return proc;
};

const H1 = '# ';

const parseMarkdown = (src) => src.split(H1).filter(notEmpty).map(parseProc);

module.exports = { parseMarkdown };
