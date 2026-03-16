import { test, strict } from 'poku';
import { JSONC } from '../src/index.ts';

test('JSON', () => {
  const content = `
    {
      "server": {
        "host": "localhost",
        "port": 8080,
        "security": {
          "https": true,
          "certificatePath": "/path/to/cert.pem",
          "keyPath": "/path/to/key.pem"
        }
      },
      "database": {
        "type": "mysql",
        "host": "db.example.com",
        "port": 3306,
        "username": "db_user",
        "password": "db_pass",
        "name": "app_db",
        "pool": {
          "min": 2,
          "max": 10,
          "idleTimeoutMillis": 30000
        }
      },
      "logging": {
        "level": "debug",
        "file": "/var/log/app.log",
        "maxSize": "10m",
        "maxFiles": "5",
        "format": "json"
      },
      "api": {
        "basePath": "/api/v1",
        "timeout": 5000,
        "retries": 3
      },
      "auth": {
        "jwtSecret": "supersecretkey",
        "tokenExpiration": "1h",
        "refreshTokenExpiration": "7d"
      },
      "cache": {
        "enabled": true,
        "type": "redis",
        "host": "cache.example.com",
        "port": 6379,
        "ttl": 3600
      }
    }
  `;

  strict.deepStrictEqual(
    JSONC.parse(content),
    {
      server: {
        host: 'localhost',
        port: 8080,
        security: {
          https: true,
          certificatePath: '/path/to/cert.pem',
          keyPath: '/path/to/key.pem',
        },
      },
      database: {
        type: 'mysql',
        host: 'db.example.com',
        port: 3306,
        username: 'db_user',
        password: 'db_pass',
        name: 'app_db',
        pool: { min: 2, max: 10, idleTimeoutMillis: 30000 },
      },
      logging: {
        level: 'debug',
        file: '/var/log/app.log',
        maxSize: '10m',
        maxFiles: '5',
        format: 'json',
      },
      api: { basePath: '/api/v1', timeout: 5000, retries: 3 },
      auth: {
        jwtSecret: 'supersecretkey',
        tokenExpiration: '1h',
        refreshTokenExpiration: '7d',
      },
      cache: {
        enabled: true,
        type: 'redis',
        host: 'cache.example.com',
        port: 6379,
        ttl: 3600,
      },
    },
    'paser'
  );

  strict.equal(
    JSONC.minify(content),
    `{"server":{"host":"localhost","port":8080,"security":{"https":true,"certificatePath":"/path/to/cert.pem","keyPath":"/path/to/key.pem"}},"database":{"type":"mysql","host":"db.example.com","port":3306,"username":"db_user","password":"db_pass","name":"app_db","pool":{"min":2,"max":10,"idleTimeoutMillis":30000}},"logging":{"level":"debug","file":"/var/log/app.log","maxSize":"10m","maxFiles":"5","format":"json"},"api":{"basePath":"/api/v1","timeout":5000,"retries":3},"auth":{"jwtSecret":"supersecretkey","tokenExpiration":"1h","refreshTokenExpiration":"7d"},"cache":{"enabled":true,"type":"redis","host":"cache.example.com","port":6379,"ttl":3600}}`,
    'minify'
  );

  strict.equal(
    JSONC.stringify(content, null, 2),
    `{
  "server": {
    "host": "localhost",
    "port": 8080,
    "security": {
      "https": true,
      "certificatePath": "/path/to/cert.pem",
      "keyPath": "/path/to/key.pem"
    }
  },
  "database": {
    "type": "mysql",
    "host": "db.example.com",
    "port": 3306,
    "username": "db_user",
    "password": "db_pass",
    "name": "app_db",
    "pool": {
      "min": 2,
      "max": 10,
      "idleTimeoutMillis": 30000
    }
  },
  "logging": {
    "level": "debug",
    "file": "/var/log/app.log",
    "maxSize": "10m",
    "maxFiles": "5",
    "format": "json"
  },
  "api": {
    "basePath": "/api/v1",
    "timeout": 5000,
    "retries": 3
  },
  "auth": {
    "jwtSecret": "supersecretkey",
    "tokenExpiration": "1h",
    "refreshTokenExpiration": "7d"
  },
  "cache": {
    "enabled": true,
    "type": "redis",
    "host": "cache.example.com",
    "port": 6379,
    "ttl": 3600
  }
}`,
    'stringify (from a string)'
  );

  strict.equal(
    JSONC.stringify({ a: 123 }, null, 2),
    `{
  "a": 123
}`,
    'stringify'
  );
});

test('JSON: BOM', () => {
  strict.deepStrictEqual(
    JSONC.parse('\uFEFF{"a":1}'),
    { a: 1 },
    'parse: BOM-prefixed object'
  );

  strict.equal(
    JSONC.toJSON('\uFEFF{"a":1}'),
    '{"a":1}',
    'toJSON: BOM stripped'
  );

  strict.equal(
    JSONC.minify('\uFEFF{ "a" : 1 }'),
    '{"a":1}',
    'minify: BOM-prefixed input'
  );
});

test('JSON: Trailing Commas', () => {
  strict.deepStrictEqual(
    JSONC.parse('{"a":1,}'),
    { a: 1 },
    'parse: trailing comma in object'
  );

  strict.deepStrictEqual(
    JSONC.parse('{"a":1,"b":2,}'),
    { a: 1, b: 2 },
    'parse: trailing comma after multiple properties'
  );

  strict.deepStrictEqual(
    JSONC.parse('[1,2,3,]'),
    [1, 2, 3],
    'parse: trailing comma in array'
  );

  strict.deepStrictEqual(
    JSONC.parse('{"a":[1,],}'),
    { a: [1] },
    'parse: nested trailing commas'
  );

  strict.equal(
    JSONC.toJSON('{"a":1,}'),
    '{"a":1}',
    'toJSON: trailing comma removed'
  );

  strict.deepStrictEqual(
    JSONC.parse('{"a":"b,"}'),
    { a: 'b,' },
    'parse: comma inside string before } is preserved'
  );

  strict.deepStrictEqual(
    JSONC.parse('{"a":",]"}'),
    { a: ',]' },
    'parse: comma inside string before ] is preserved'
  );

  strict.deepStrictEqual(
    JSONC.parse('[",}", 1]'),
    [',}', 1],
    'parse: string with trailing comma pattern in array'
  );

  strict.deepStrictEqual(
    JSONC.parse('{"a":{"b":[1,],},}'),
    { a: { b: [1] } },
    'parse: deeply nested trailing commas'
  );
});
