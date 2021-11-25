import express from 'express';
import {logger} from './logger';

const PORT = process.env['PORT'] ?? 8000;

const app = express();

// Use built-in JSON parser from express.
app.use(express.json());

app.listen(PORT, () => {
  logger.log(`Listening on port ${PORT}`);
});
