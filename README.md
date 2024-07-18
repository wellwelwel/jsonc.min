<h1 align="center">jsonc.min</h1>
<p align="center">✨ Safer <strong>JSON</strong> and <strong>JSONC</strong> minify, parse and stringify for <strong>JavaScript</strong> (<strong>Browser</strong> compatible).

## Why

#### 🔐 Safety

> Many _JSON_ minification packages rely on vulnerable _regex_, making them unsuitable for production.

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/poku/main/.github/assets/readme/check.svg"> **json.min** prioritizes security by avoiding these pitfalls and offering a robust solution.

#### 🤝 Compatibility

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/poku/main/.github/assets/readme/check.svg"> **json.min** ensures full compatibility with both **Node.js**, **Bun**, **Deno** and, browser environments.<br />
<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/poku/main/.github/assets/readme/check.svg"> All features work for both _JSON_ and _JSONC_.

#### 🪶 Lightweight

<img width="16" height="16" alt="check" src="https://raw.githubusercontent.com/wellwelwel/poku/main/.github/assets/readme/check.svg"> Zero dependencies and optimized for production environments.

---

## Install

```bash
npm i json.min
```

---

## Usage

### Import

```js
import { JSONC } from 'json.min';
```

```js
const { JSONC } = require('json.min');
```

---

### `toJSON`

Convert _JSONC_ to _JSON_.

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

> Use `JSON.strinfy` behind the scenes.

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
import { JSONC } from 'json.min';

const content = await readFile('./file.jsonc', 'utf-8');

JSONC.parse(content);
```

### Parsing a dynamic config file

For this example, let's assume a `.configrc` that can be both a _JSON_ or a _JSONC_, as well as looking for both `config.json` and `config.jsonc` files:

```ts
import { JSONC } from 'json.min';
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

      // json.min will parse both JSON and JSONC extensions, even if there is no extension.
      return JSONC.parse(configsFile);
    } catch {
      return {};
    }
  }
};
```

---

## Acknowledgements

[![Contributors](https://img.shields.io/github/contributors/wellwelwel/json.min?label=Contributors)](https://github.com/wellwelwel/json.min/graphs/contributors)
