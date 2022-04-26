# Lowscript

Set of DSL syntaxes for low-code with Metarhia technology stack

- Markdown-based process modeling language
- Limited subset of JavaScript for domain logic

## Usage

### Parse markdown-based domain process script

Syntax: `parseProcess(src: string): Array<DomainProcedure>;`

Result structure:

```js
interface DomainProcedure {
  name: string;
  body: Array<DomainStep>;
}
```

```js
interface DomainStep {
  command: string;
  success: Array<string>;
  fail: Array<string>;
  finalization: Array<string>;
}
```

## License & Contributors

Copyright (c) 2021-2022 [Metarhia contributors](https://github.com/metarhia/lowscript/graphs/contributors).
Lowscript is [MIT licensed](./LICENSE).\
Lowscript is a part of [Metarhia](https://github.com/metarhia) technology stack.
