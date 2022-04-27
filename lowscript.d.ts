import { EventEmitter } from 'events';

export interface DomainStep {
  command: string;
  success: Array<string>;
  fail: Array<string>;
  finalization: Array<string>;
}

export interface DomainProcedure {
  name: string;
  body: Array<DomainStep>;
}

export class Runtime extends EventEmitter {
  processes: Map<string, DomainProcedure>;
  constructor();
  register(processes: Array<DomainProcedure>);
  exec(name: string);
}

export function parseMarkdown(src: string): Array<DomainProcedure>;
