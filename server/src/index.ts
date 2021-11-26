import express from 'express';
import {logger} from './logger';
import {getData} from './endpoints/get-data';
import {config, prettyPrintConfig} from './config';

const app = express();

logger.stdout = config.LOG_STDOUT;
logger.outFile = config.LOG_FILE;

// Use built-in JSON parser from express.
app.use(express.json());

app.get('/data', getData);


logger.log('Starging server with config:\n' + prettyPrintConfig());

app.listen(config.PORT, config.HOST, () => {
  logger.log('Server started.');
  logger.log(`Now listening on ${config.HOST}:${config.PORT}.`);
});
