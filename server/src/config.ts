export const config = {
  HOST: process.env['NODE_HOST'] ?? 'localhost',
  PORT: parseInt(process.env['NODE_PORT'] ?? '3000'),
  LOG_STDOUT: !(process.env['LOG_STDOUT'] === 'false'),
  LOG_FILE: process.env['LOG_FILE'] ?? undefined,
  DATA_FILE: process.env['DATA_FILE'] ?? 'data.json',
};

export const prettyPrintConfig = () =>
  `{
  HOST: ${config.HOST},
  PORT: ${config.PORT},
  LOG_STDOUT: ${config.LOG_STDOUT},
  LOG_FILE: ${config.LOG_FILE},
  DATA_FILE: ${config.DATA_FILE}
}`;
