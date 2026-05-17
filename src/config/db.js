const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true';
const sql = useWindowsAuth ? require('mssql/msnodesqlv8') : require('mssql');

function buildOdbcServer() {
  if (process.env.DB_SERVER) {
    return process.env.DB_SERVER;
  }
  const instance = process.env.DB_INSTANCE || 'SQLEXPRESS';
  return `.\\${instance}`;
}

function buildConnectionString() {
  const driver = process.env.DB_ODBC_DRIVER || 'ODBC Driver 17 for SQL Server';
  const server = buildOdbcServer();
  const database = process.env.DB_DATABASE || 'todo_api';

  let connectionString =
    `Driver={${driver}};Server=${server};Database=${database};TrustServerCertificate=yes;`;

  if (useWindowsAuth) {
    connectionString += 'Trusted_Connection=yes;';
  } else {
    connectionString += `UID=${process.env.DB_USER};PWD=${process.env.DB_PASSWORD};`;
  }

  return connectionString;
}

function buildTcpConfig() {
  const options = {
    encrypt: process.env.DB_ENCRYPT !== 'false',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  };

  const config = {
    database: process.env.DB_DATABASE,
    options,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    connectionTimeout: 15000,
    requestTimeout: 30000,
  };

  if (process.env.DB_PORT) {
    config.server = process.env.DB_SERVER || '127.0.0.1';
    config.port = Number(process.env.DB_PORT);
  } else if (process.env.DB_SERVER && process.env.DB_SERVER.includes('\\')) {
    config.server = process.env.DB_SERVER;
  } else {
    const host = process.env.DB_SERVER || 'localhost';
    const instance = process.env.DB_INSTANCE;
    config.server = instance ? `${host}\\${instance}` : host;
  }

  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;

  return config;
}

function buildConfig() {
  if (useWindowsAuth) {
    return {
      connectionString: buildConnectionString(),
      driver: 'msnodesqlv8',
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };
  }

  return buildTcpConfig();
}

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(buildConfig());
  }
  return pool;
}

function getConnectionInfo() {
  if (useWindowsAuth) {
    return { mode: 'odbc-windows', server: buildOdbcServer() };
  }
  const cfg = buildTcpConfig();
  return {
    mode: 'tcp',
    server: cfg.port ? `${cfg.server}:${cfg.port}` : cfg.server,
  };
}

module.exports = { sql, getPool, getConnectionInfo };
