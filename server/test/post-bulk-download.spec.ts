import {app, shutDown} from '../src/index';
import express from 'express';
import {Server} from 'http';
import fs from 'fs';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config';
import {writeDataFile} from '../src/fs-helper';
import {Show} from '@easy-show-downloader/common/dist/show';

chai.use(chaiHttp);

describe('POST /api/bulk-download', () => {
  const fileName = 'post-bulk-download-test.json';
  const oldFileName = config.DATA_FILE;
  const oldLogStdout = config.LOG_STDOUT;
  let server: Server;

  before(() => {
    config.DATA_FILE = fileName;
    config.LOG_STDOUT = false;
    // Serve dummy data
    shutDown();
    app.use(express.static('test/data'));
    server = app.listen(config.PORT, config.HOST);
  });

  after(() => {
    server.close();
    config.DATA_FILE = oldFileName;
    config.LOG_STDOUT = oldLogStdout;
  });

  it('Should successfully add torrents to the client', async () => {
    const data = {
      shows: [new Show('Dragon Quest')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    await writeDataFile(fileName, data);

    const res = await chai.request(app)
      .post('/api/bulk-download')
      .send({folder: 'Bulk folder', rssUrl: `http://${config.HOST}:${config.PORT}/test-rss-3.xml`});
    expect(res).to.have.status(200);
    expect(res).to.have.header('Content-Type', /application\/json/);
    expect(res.body['torrentsAdded']).to.equal(30);
    await fs.promises.rm(fileName, {force: true});
  });
});
