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
