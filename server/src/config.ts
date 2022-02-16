export const config = {
  HOST: process.env['NODE_HOST'] ?? 'localhost',
  PORT: parseInt(process.env['NODE_PORT'] ?? '3000'),
  STATIC_DIR: process.env['STATIC_DIR'] ?? '../client/public',
  LOG_STDOUT: process.env['LOG_STDOUT'] !== 'false',
  LOG_FILE: process.env['LOG_FILE'] ?? undefined,
  DATA_FILE: process.env['DATA_FILE'] ?? 'data.json',
  CRON_SCHEDULE: process.env['CRON_SCHEDULE'] ?? '0 53 * * * *',
  transmission: {
    host: process.env['TRANSMISSION_HOST'] ?? 'localhost',
    port: parseInt(process.env['TRANSMISSION_PORT'] ?? '9091'),
    username: process.env['TRANSMISSION_USERNAME'] ?? '',
    password: process.env['TRANSMISSION_PASSWORD'] ?? '',
    ssl: process.env['TRANSMISSION_PROTOCOL'] === 'https',
    url: process.env['TRANSMISSION_URL'] ?? '/transmission/rpc',
  },
};

export const prettyPrintConfig = () =>
  `{
  NODE_HOST: '${config.HOST}',
  NODE_PORT: ${config.PORT},
  STATIC_DIR: '${config.STATIC_DIR}',
  LOG_STDOUT: ${config.LOG_STDOUT},
  LOG_FILE: ${config.LOG_FILE ? '\'' + config.LOG_FILE + '\'' : 'undefined'},
  DATA_FILE: '${config.DATA_FILE}',
  CRON_SCHEDULE: '${config.CRON_SCHEDULE}',
  transmission: {
    host: '${config.transmission.host}',
    port: ${config.transmission.port},
    username: '${config.transmission.username}',
    password: ${config.transmission.password.length > 0 ? '[REDACTED]' : ''},
    ssl: ${config.transmission.ssl},
    url: '${config.transmission.url}',
  }
}`;
