'use strict';

const { EventEmitter } = require('events');
const { replace } = require('metautil');

const COMMANDS = ['form', 'notify', 'finalization'];

const parseCommand = (src) => {
  const pos = src.indexOf(' ');
  if (pos === -1) return { identifier: src };
  const identifier = src.substring(0, pos);
  const parameters = replace(src.substring(pos + 1, src.length), '`', '');
  return { identifier, parameters };
};

const parseSignature = (src) => {
  const s = replace(src, '`', '');
  const open = s.indexOf('(');
  if (!open) return { identifier: s };
  const close = s.indexOf(')');
  if (!close) throw new Error(`Signature "${s}" is not valid`);
  const identifier = s.substring(0, open);
  const parameters = s.substring(open + 1, close).split(',');
  const result = replace(s.substring(close + 1, s.length), ':', '').trim();
  return { identifier, parameters, result };
};

class Runtime extends EventEmitter {
  constructor({ processes, procedures, context, model }) {
    super();
    this.processes = processes || {};
    this.procedures = procedures || {};
    this.context = context || {};
    this.model = model || {};
  }

  async exec(name) {
    const proc = this.processes[name];
    if (!proc) throw new Error(`Domain process "${name}" is not found`);
    const finalization = [];
    for (const step of proc.body) {
      if (step.finalization) {
        finalization.push(step.finalization);
      }
      try {
        await this.command(step);
        this.success(step);
      } catch (err) {
        this.fail(step);
        throw err;
      }
    }
  }

  async success(step) {
    for (const cmd of step.success) {
      this.command({ command: cmd });
    }
  }

  async fail(step) {
    for (const cmd of step.fail) {
      this.command({ command: cmd });
    }
  }

  async command(step) {
    const name = step.command;
    const cmd = this.processes[name];
    if (cmd) return this.exec(name);
    const { identifier } = parseCommand(name);
    const keyword = identifier.toLowerCase();
    if (COMMANDS.includes(keyword)) return this[keyword](step);
    if (name.startsWith('`')) return this.invoke(step);
    throw new Error(`Command "${name}" is not found`);
  }

  async invoke(step) {
    const meta = parseSignature(step.command);
    const proc = this.procedures[meta.identifier];
    if (!proc) {
      throw new Error(`Domain procedure "${meta.identifier}" is not found`);
    }
    const result = await proc(this.context);
    const key = meta.result.toLowerCase();
    this.context[key] = result;
    this.emit('invoke', { procedure: meta.identifier, result });
  }

  async form(step) {
    return new Promise((resolve, reject) => {
      this.once('form/submit', async (data) => {
        try {
          const command = parseCommand(step.command);
          const key = command.parameters.toLowerCase();
          const identifier = key + command.identifier;
          const proc = this.procedures[identifier];
          const context = { ...this.context, [identifier]: data };
          const result = await proc(context);
          this.context[key] = result;
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      this.emit('form/show', step);
    });
  }

  async notify(step) {
    this.emit('notify', step.command);
  }

  async finalization(step) {
    this.emit('finalization', step.command);
  }
}

module.exports = { Runtime };
