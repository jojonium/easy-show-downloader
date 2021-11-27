import {Show} from '@easy-show-downloader/common/dist/show';
import {expect} from 'chai';
import express from 'express';
import {Server} from 'http';
import {addTorrents} from '../src/add-torrents';
import {config} from '../src/config';
import {app, shutDown} from '../src/index';
import {resolveTorrents} from '../src/resolve-torrents';

describe('addTorrents()', () => {
  const oldLogStdout = config.LOG_STDOUT;
  let server: Server;

  before(() => {
    config.LOG_STDOUT = false;
    // Serve dummy data
    shutDown();
    app.use(express.static('test/data'));
    server = app.listen(config.PORT, config.HOST);
  });

  after(async () => {
    server.close();
    config.LOG_STDOUT = oldLogStdout;
  });

  it('Should add multiple torrents for a single show', async () => {
    const data = {
      shows: [new Show('Dragon Quest')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const r = await resolveTorrents(data);
    expect(r['Dragon Quest']?.links).to.have.lengthOf(7);
    const c = await addTorrents(r);
    expect(c).to.equal(7);
  });

  it('Should add zero torrents for a not-found show', async () => {
    const data = {
      shows: [new Show('Fake show')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const r = await resolveTorrents(data);
    expect(r['Fake show']?.links).to.be.empty;
    const c = await addTorrents(r);
    expect(c).to.equal(0);
  });
});
