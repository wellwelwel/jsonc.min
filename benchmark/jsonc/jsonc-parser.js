const fs = require('node:fs');
const { parse } = require('jsonc-parser');

const file = fs.readFileSync('resources/input.jsonc', 'utf-8');

const inputs = [
  file,
  '{"a":1,}',
  '\uFEFF{"a":1}',
  '{"a":1,/* comment */}',
  '{"a":1,// comment\n}',
  '[1,2,3,]',
  '\uFEFF{"a":1,/* comment */}',
  '\uFEFF[1,// trailing\n2,]',
];

for (let i = 0; i < 10_000; i++) {
  for (const input of inputs) {
    parse(input);
  }
}
