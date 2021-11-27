export const config = {
  HOST: process.env['NODE_HOST'] ?? 'localhost',
  PORT: parseInt(process.env['NODE_PORT'] ?? '3000'),
  LOG_STDOUT: !(process.env['LOG_STDOUT'] === 'false'),
  LOG_FILE: process.env['LOG_FILE'] ?? undefined,
  DATA_FILE: process.env['DATA_FILE'] ?? 'data.json',
  CRON_SCHEDULE: process.env['CRON_SCHEDULE'] ?? '0 53 * * * *',
  transmission: {
    HOST: process.env['TRANSMISSION_HOST'] ?? 'localhost',
    PORT: parseInt(process.env['TRANSMISSION_PORT'] ?? '9091'),
    USERNAME: process.env['TRANSMISSION_USERNAME'] ?? '',
    PASSWORD: process.env['TRANSMISSION_PASSWORD'] ?? '',
    SSL: process.env['TRANSMISSION_PROTOCOL'] === 'https',
    URL: process.env['TRANSMISSION_URL'] ?? '/transmission/rpc',
  },
};

export const prettyPrintConfig = () =>
  `{
  HOST: ${config.HOST},
  PORT: ${config.PORT},
  LOG_STDOUT: ${config.LOG_STDOUT},
  LOG_FILE: ${config.LOG_FILE},
  DATA_FILE: ${config.DATA_FILE},
  CRON_SCHEDULE: '${config.CRON_SCHEDULE}',
  transmission: {
    HOST: ${config.transmission.HOST},
    PORT: ${config.transmission.PORT},
    USERNAME: '${config.transmission.USERNAME}',
    PASSWORD: ${config.transmission.PASSWORD.length > 0 ? '[REDACTED]' : ''},
    SSL: ${config.transmission.SSL},
    URL: ${config.transmission.URL},
  }
}`;
