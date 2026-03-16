export const JSONC = (() => {
  class JsoncProcessor {
    toJSON(content: string): string {
      const input =
        content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;

      const length = input.length;

      let inBlockComment = false;
      let inString = false;
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
          if (char === '"' && input[i - 1] !== '\\') {
            inString = false;
          }

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

    parse<T = unknown>(
      text: string,
      reviver?: (this: unknown, key: string, value: unknown) => unknown
    ): T {
      const cleanContent = this.toJSON(text);

      return JSON.parse(cleanContent, reviver);
    }

    stringify(
      value: unknown,
      replacer?: (this: unknown, key: string, value: unknown) => unknown,
      space?: string | number
    ): string;
    stringify(
      value: unknown,
      replacer?: (number | string)[] | null,
      space?: string | number
    ): string;
    stringify(
      value: unknown,
      replacer?:
        | ((this: unknown, key: string, value: unknown) => unknown)
        | (number | string)[]
        | null,
      space?: string | number
    ): string {
      const source = typeof value === 'string' ? this.parse(value) : value;

      if (typeof replacer === 'function') {
        return JSON.stringify(source, replacer, space);
      }

      return JSON.stringify(source, replacer, space);
    }

    minify(content: string): string {
      const parsedConfig = this.parse(content);

      return JSON.stringify(parsedConfig, null, 0);
    }
  }

  return new JsoncProcessor();
})();
