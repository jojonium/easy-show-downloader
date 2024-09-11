import {expect} from 'chai';
import express from 'express';
import {Server} from 'http';
import {addTorrents} from '../src/add-torrents';
import {config} from '../src/config';
import {app, shutDown} from '../src/index';
import {bulkResolve} from '../src/bulk-resolve';

describe('bulkResolve()', () => {
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

  it('Should add all torrents from a single feed', async () => {
    const rssUrl = `http://${config.HOST}:${config.PORT}/test-rss-1.xml`;
    const links = await bulkResolve('Bulk Folder', rssUrl);
    expect(links).to.have.lengthOf(75);
    expect(links[15].folder).to.equal('Bulk Folder');
    const c = await addTorrents(links);
    expect(c).to.equal(75);
  });
});
