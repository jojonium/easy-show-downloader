import express from 'express';
import {logger} from './logger';
import {getData} from './endpoints/get-data';
import {config, prettyPrintConfig} from './config';
import {postData} from './endpoints/post-data';

export const app = express();

// Use built-in JSON parser from express.
app.use(express.json());

app.get('/data', getData);
app.post('/data', postData);

logger.log('Starting server with config:\n' + prettyPrintConfig());

const server = app.listen(config.PORT, config.HOST, () => {
  logger.log('Server started.');
  logger.log(`Now listening on ${config.HOST}:${config.PORT}.`);
});

export const shutDown = () => {
  logger.log('Shutting down.');
  server.close();
};

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
