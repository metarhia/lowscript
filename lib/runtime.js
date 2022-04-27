'use strict';

class Runtime {
  constructor() {
    this.processes = new Map();
  }

  register(processes) {
    for (const proc of processes) {
      this.processes.set(proc.name, proc);
    }
  }

  exec(name) {
    const proc = this.processes.get(name);
    if (!proc) throw new Error(`Procedure ${name} is not found`);
  }
}

module.exports = { Runtime };
