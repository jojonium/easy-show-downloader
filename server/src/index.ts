import {CronJob} from 'cron';
import express from 'express';
import {addTorrents} from './add-torrents';
import {config, prettyPrintConfig} from './config';
import {getData} from './endpoints/get-data';
import {getHealth} from './endpoints/get-health';
import {postBulkDownload} from './endpoints/post-bulk-download';
import {postData} from './endpoints/post-data';
import {postDownload} from './endpoints/post-download';
import {readDataFile} from './fs-helper';
import {logger} from './logger';
import {resolveTorrents} from './resolve-torrents';

export const app = express();

// Use built-in JSON parser from express.
app.use(express.json());

app.get('/api/data', getData);
app.post('/api/data', postData);
app.post('/api/download', postDownload);
app.post('/api/bulk-download', postBulkDownload);
app.get('/api/health', getHealth);

app.use(
  express.static(config.STATIC_DIR,
    {index: ['index.html'], extensions: ['html']}),
);

logger.log('Starting server with config:\n' + prettyPrintConfig());

// Set up cron job if enabled.
let job: CronJob | undefined = undefined;
if (config.CRON_SCHEDULE !== '') {
  try {
    job = new CronJob(
      config.CRON_SCHEDULE,
      async () => {
        try {
          const data = await readDataFile(config.DATA_FILE);
          const torrents = await resolveTorrents(data);
          await addTorrents(torrents, data.mediaRoot);
        } catch (e) {
          logger.log(
            `Error in cron job (schedule '${config.CRON_SCHEDULE}')\n` + e,
            'ERROR',
          );
        }
      },
      undefined,
      true,
    );
    logger.log(`Created cron job with schedule '${config.CRON_SCHEDULE}'.`);
  } catch (e) {
    logger.log(
      `Error creating cron job with schedule '${config.CRON_SCHEDULE}'\n` + e,
      'ERROR',
    );
  }
}

const server = app.listen(config.PORT, config.HOST, () => {
  logger.log('Server started.');
  logger.log(`Now listening on ${config.HOST}:${config.PORT}.`);
});

export const shutDown = () => {
  logger.log('Shutting down.');
  if (job) job.stop();
  server.close();
};

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
