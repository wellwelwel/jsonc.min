import { test, strict } from 'poku';
import { JSONC } from '../src/index.ts';

test('JSONC', () => {
  const content = `
    /** Configuração do Servidor */

    /** Configuração do Servidor **/
    /**
      Configuração do Servidor
    **/

    /*
      Configuração do Servidor
    */
    /**
      Configuração do Servidor
    */
    /*
      Configuração do Servidor
    **/
    /**
      * Configuração do Servidor # //
    **/

    {
      // Configuração do Servidor
      "server": {
        "host": "localhost", // Endereço do servidor
        "port": 8080, /* Porta do servidor */

        /* Configurações de segurança */
        "security": {
          "https": true, // Habilitar HTTPS
          "certificatePath": "/path/to/cert.pem", /* Caminho para o certificado */
          "keyPath": "/path/to/key.pem" // Caminho para a chave privada
        }
      },

      // Configurações de banco de dados
      "database": {
        "type": "mysql", /* Tipo de banco de dados */
        "host": "db.example.com", // Endereço do banco de dados
        "port": 3306, /* Porta do banco de dados */
        "username": "db_user", // Nome de usuário do banco de dados
        "password": "db_pass", /* Senha do banco de dados */
        "name": "app_db", // Nome do banco de dados

        /* Configurações avançadas */
        "pool": {
          "min": 2, // Conexões mínimas no pool
          "max": 10, /* Conexões máximas no pool */
          "idleTimeoutMillis": 30000 // Tempo máximo de ociosidade (ms)
        }
      },

      // Configurações de log
      "logging": {
        "level": "debug", /* Nível de log */
        "file": "/var/log/app.log", // Caminho do arquivo de log
        "maxSize": "10m", /* Tamanho máximo do arquivo de log */
        "maxFiles": "5", // Número máximo de arquivos de log
        "format": "json" /* Formato do log */
      },

      /* Configurações de API */
      "api": {
        "basePath": "/api/v1", // Caminho base da API
        "timeout": 5000, /* Timeout da API (ms) */
        "retries": 3 // Número de tentativas em caso de falha
      },

      // Configurações de autenticação
      "auth": {
        "jwtSecret": "supersecretkey", /* Chave secreta para JWT */
        "tokenExpiration": "1h", // Expiração do token
        "refreshTokenExpiration": "7d" /* Expiração do token de atualização */
      },

      /* Configurações de cache */
      "cache": {
        "enabled": true, // Habilitar cache
        "type": "redis", /* Tipo de cache */
        "host": "cache.example.com", // Endereço do cache
        "port": 6379, /* Porta do cache */
        "ttl": 3600 // Tempo de vida do cache (s)
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
