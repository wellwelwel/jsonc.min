export const JSONC = (() => {
  function toJSON(content: string): string {
    const input = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;

    const length = input.length;

    let inBlockComment = false;
    let inString = false;
    let escaped = false;
    let skipChar = false;
    let pending = '';
    let result = '';

    for (let i = 0; i < length; i++) {
      const char = input[i];

      if (skipChar) {
        skipChar = false;
        continue;
      }

      if (inBlockComment) {
        if (char === '*' && input[i + 1] === '/') {
          inBlockComment = false;
          skipChar = true;
        }

        continue;
      }

      if (inString) {
        if (char === '"' && !escaped) {
          inString = false;
        }

        escaped = char === '\\' && !escaped;
        result += char;
        continue;
      }

      if (char === '"') {
        result += pending;
        pending = '';
        inString = true;
        result += char;
        continue;
      }

      if (char === '/' && input[i + 1] === '*') {
        inBlockComment = true;
        skipChar = true;
        continue;
      }

      if (char === '/' && input[i + 1] === '/') {
        while (i < length && input[i] !== '\n') {
          i++;
        }

        continue;
      }

      if (char === ',') {
        pending = ',';
      } else if (char === ']' || char === '}') {
        pending = '';
        result += char;
      } else if (pending && char <= ' ') {
        pending += char;
      } else {
        result += pending;
        pending = '';
        result += char;
      }
    }

    return result;
  }

  function parse<T = unknown>(
    text: string,
    reviver?: (this: unknown, key: string, value: unknown) => unknown
  ): T {
    return JSON.parse(toJSON(text), reviver);
  }

  function stringify(
    value: unknown,
    replacer?: (this: unknown, key: string, value: unknown) => unknown,
    space?: string | number
  ): string;
  function stringify(
    value: unknown,
    replacer?: (number | string)[] | null,
    space?: string | number
  ): string;
  function stringify(
    value: unknown,
    replacer?:
      | ((this: unknown, key: string, value: unknown) => unknown)
      | (number | string)[]
      | null,
    space?: string | number
  ): string {
    const source = typeof value === 'string' ? parse(value) : value;

    if (typeof replacer === 'function') {
      return JSON.stringify(source, replacer, space);
    }

    return JSON.stringify(source, replacer, space);
  }

  function minify(content: string): string {
    return JSON.stringify(parse(content), null, 0);
  }

  return { toJSON, parse, stringify, minify };
})();
