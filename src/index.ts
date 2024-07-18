class JsoncProcessor {
  toJSON(content: string): string {
    const lines = content.split('\n');
    const resultLines: string[] = [];

    let inBlockComment = false;
    let inString = false;

    for (const line of lines) {
      let newLine = '';

      for (let i = 0; i < line.length; i++) {
        if (inBlockComment) {
          if (line[i] === '*' && line[i + 1] === '/') {
            inBlockComment = false;
            i++;
          }

          continue;
        }

        if (inString) {
          if (line[i] === '"' && line[i - 1] !== '\\') {
            inString = false;
          }
          newLine += line[i];
          continue;
        }

        if (line[i] === '"') {
          inString = true;
          newLine += line[i];
          continue;
        }

        if (line[i] === '/' && line[i + 1] === '*') {
          inBlockComment = true;
          i++;
          continue;
        }

        if (line[i] === '/' && line[i + 1] === '/') {
          break;
        }

        newLine += line[i];
      }

      if (newLine.trim().length > 0) {
        resultLines.push(newLine.trim());
      }
    }

    return resultLines.join('');
  }

  parse(
    text: string,
    reviver?: (this: unknown, key: string, value: unknown) => unknown
  ): string {
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

export const JSONC = new JsoncProcessor();
