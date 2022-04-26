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

export function parseProcess(src: string): Array<DomainProcedure>;
