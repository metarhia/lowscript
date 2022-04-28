import { EventEmitter } from 'events';

export interface DomainStep {
  command: string;
  success: Array<string>;
  fail: Array<string>;
  finalization: Array<string>;
}

export interface DomainProcess {
  name: string;
  body: Array<DomainStep>;
}

export class Runtime extends EventEmitter {
  processes: Map<string, DomainProcess>;
  constructor();
  register(processes: Array<DomainProcess>);
  exec(name: string);
}

export function parseMarkdown(src: string): Array<DomainProcess>;
