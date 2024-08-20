<h1 align="center">jsonc.min</h1>
<div align="center">

[![NPM Version](https://img.shields.io/npm/v/jsonc.min.svg?label=&color=70a1ff&logo=npm&logoColor=white)](https://www.npmjs.com/package/jsonc.min)
[![GitHub Workflow Status (Node.js)](https://img.shields.io/github/actions/workflow/status/wellwelwel/jsonc.min/ci_node.yml?event=push&label=&branch=main&logo=nodedotjs&logoColor=535c68&color=badc58)](https://github.com/wellwelwel/jsonc.min/actions/workflows/ci_node.yml?query=branch%3Amain)
[![GitHub Workflow Status (Bun)](https://img.shields.io/github/actions/workflow/status/wellwelwel/jsonc.min/ci_bun.yml?event=push&label=&branch=main&logo=bun&logoColor=ffffff&color=f368e0)](https://github.com/wellwelwel/jsonc.min/actions/workflows/ci_bun.yml?query=branch%3Amain)
[![GitHub Workflow Status (Deno)](https://img.shields.io/github/actions/workflow/status/wellwelwel/jsonc.min/ci_deno.yml?event=push&label=&branch=main&logo=deno&logoColor=ffffff&color=079992)](https://github.com/wellwelwel/jsonc.min/actions/workflows/ci_deno.yml?query=branch%3Amain)

✨ Faster and safer <strong>JSON</strong> and <strong>JSONC</strong> minify, parse and stringify for <strong>JavaScript</strong> (<strong>Browser</strong> compatible) — **9kB**.

</div>

## Why

#### 🔐 Safety

> Many _JSON_ minification packages rely on vulnerable _regex_, making them unsuitable for production.

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/jsonc.min/main/.github/assets/readme/check.svg"> **jsonc.min** prioritizes security by avoiding these pitfalls and offering a robust solution.

#### 🤝 Compatibility

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/jsonc.min/main/.github/assets/readme/check.svg"> **jsonc.min** ensures full compatibility with both **Node.js**, **Bun**, **Deno** and, browser environments.<br />
<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/jsonc.min/main/.github/assets/readme/check.svg"> All features work for both _JSON_ and _JSONC_.

#### 🪶 Lightweight

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/jsonc.min/main/.github/assets/readme/check.svg"> Zero dependencies and optimized for production environments.

---

## Install

[![Install Size](https://packagephobia.com/badge?p=jsonc.min)](https://pkg-size.dev/jsonc.min)

```bash
# Node.js
npm i jsonc.min
```

```bash
# Bun
bun add jsonc.min
```

```bash
# Deno
deno add npm:jsonc.min
```

---

## Usage

### Import

```js
import { JSONC } from 'jsonc.min';
```

```js
const { JSONC } = require('jsonc.min');
```

---

### `toJSON`

Convert from _JSONC_ to _JSON_.

```js
JSONC.toJSON('/* JSONC content */ { "test": true }');
// "{ test: true }"
```

If the content is already _JSON_, it will just be preserved:

```js
JSONC.toJSON('{ "test": true }');
// "{ test: true }"
```

---

### `minify`

Minify both _JSON_ and _JSONC_.

```js
const content = `
  /**
   * JSONC content
   */
  {
    "test": true // 🔬
  }
`;

JSONC.minify(content);
// "{test:true}"
```

```js
const content = `
  {
    "test": true
  }
`;

JSONC.minify(content);
// "{test:true}"
```

---

### `parse`

Parse both _JSON_ and _JSONC_.

```js
const content = `
  /**
   * JSONC content
   */
  {
    "test": true // 🔬
  }
`;

JSONC.parse(content);
// { test: true }
```

```js
const content = `
  {
    "test": true
  }
`;

JSONC.parse(content);
// { test: true }
```

- If your content is guaranteed to be a _JSON_, there is no advantage to using `JSONC.parse(content)` instead of `JSON.parse(content)`.

---

### `stringify`

Prettify both _JSON_ and _JSONC_.

> Use `JSON.stringify` behind the scenes.

```js
const content = '/** JSONC content */ { "test": true }';

JSONC.stringify(content, null, 2);
// "{
//    "test": true
//  }"
```

```js
const content = '{ "test": true }';

JSONC.stringify(content, null, 2);
// "{
//    "test": true
//  }"
```

---

## Examples

### Reading a JSON or JSONC file

```ts
import { readFile } from 'node:fs/promises';
import { JSONC } from 'jsonc.min';

const content = await readFile('./file.jsonc', 'utf-8');

JSONC.parse(content);
```

### Parsing a dynamic config file

For this example, let's assume a `.configrc` that can be both a _JSON_ or a _JSONC_, as well as looking for both `config.json` and `config.jsonc` files:

```ts
import { JSONC } from 'jsonc.min';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const getConfigs = async (customPath?: string) => {
  const targetRoot = cwd();

  const expectedFiles = customPath
    ? [customPath]
    : ['.configrc', 'config.json', 'config.jsonc'];

  for (const file of expectedFiles) {
    const filePath = join(targetRoot, file);

    try {
      const configsFile = await readFile(filePath, 'utf-8');

      // jsonc.min will parse both JSON and JSONC extensions, even if there is no extension.
      return JSONC.parse(configsFile);
    } catch {}

    return {};
  }
};
```

---

## Acknowledgements

[![Contributors](https://img.shields.io/github/contributors/wellwelwel/jsonc.min?label=Contributors)](https://github.com/wellwelwel/jsonc.min/graphs/contributors)
