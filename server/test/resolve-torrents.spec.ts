import {Show} from '@easy-show-downloader/common/dist/show';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import {Server} from 'http';
import {config} from '../src/config';
import {app, shutDown} from '../src/index';
import {resolveTorrents} from '../src/resolve-torrents';

chai.use(chaiHttp);

describe('resolveTorrents()', () => {
  const fileName = 'resolve-torrents-data.json';
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

  after(async () => {
    server.close();
    config.DATA_FILE = oldFileName;
    config.LOG_STDOUT = oldLogStdout;
  });

  it('Should resolve multiple matching links from one feed', async () => {
    const data = {
      shows: [new Show('Dragon Quest')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const r = await resolveTorrents(data);
    expect(r['Dragon Quest'].links).to.have.lengthOf(7);
    expect(r['Dragon Quest'].links[0]).to.equal(
        'https://nyaa.si/download/1460617.torrent',
    );
    expect(r['Dragon Quest'].links[1]).to.equal(
        'https://nyaa.si/download/1460612.torrent',
    );
    expect(r['Dragon Quest'].links[2]).to.equal(
        'https://nyaa.si/download/1460611.torrent',
    );
    expect(r['Dragon Quest'].links[3]).to.equal(
        'https://nyaa.si/download/1460610.torrent',
    );
    expect(r['Dragon Quest'].links[4]).to.equal(
        'https://nyaa.si/download/1460609.torrent',
    );
    expect(r['Dragon Quest'].links[5]).to.equal(
        'https://nyaa.si/download/1460607.torrent',
    );
    expect(r['Dragon Quest'].links[6]).to.equal(
        'https://nyaa.si/download/1460606.torrent',
    );
    expect(r['Dragon Quest'].folder).to.equal('Dragon Quest');
  });

  it('Should handle more complex regular expressions', async () => {
    const data = {
      shows: [new Show('Dragon Quest', /Dragon Quest.*1080p/, 'Folder Name')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const r = await resolveTorrents(data);
    expect(r['Dragon Quest'].links).to.have.lengthOf(3);
    expect(r['Dragon Quest'].links[0]).to.equal(
        'https://nyaa.si/download/1460617.torrent',
    );
    expect(r['Dragon Quest'].links[1]).to.equal(
        'https://nyaa.si/download/1460612.torrent',
    );
    expect(r['Dragon Quest'].links[2]).to.equal(
        'https://nyaa.si/download/1460610.torrent',
    );
    expect(r['Dragon Quest'].folder).to.equal('Folder Name');
  });

  it('Should only find matches in a show\'s preferred feed', async () => {
    const data = {
      shows: [
        new Show(
            'Dragon Quest',
            /Dragon Quest.*NVENC.*1080p/,
            undefined,
            `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
        ),
        new Show(
            'Shin Tetsujin 28-gou',
            undefined,
            undefined,
            `http://${config.HOST}:${config.PORT}/test-rss-2.xml`,
        ),
      ],
      rssUrls: [
        `http://${config.HOST}:${config.PORT}/test-rss-2.xml`,
        `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
      ],
    };
    const r = await resolveTorrents(data);
    expect(r['Shin Tetsujin 28-gou'].links).to.have.lengthOf(1);
    expect(r['Shin Tetsujin 28-gou'].links[0]).to.equal(
        'https://correct-link-test',
    );
  });

  it('Should return empty links lists if no matches found', async () => {
    const data = {
      shows: [
        new Show('Fake show'),
        new Show('Another fake show'),
      ],
      rssUrls: [
        `http://${config.HOST}:${config.PORT}/test-rss-2.xml`,
        `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
      ],
    };
    const r = await resolveTorrents(data);
    expect(r['Fake show'].folder).to.equal('Fake show');
    expect(r['Fake show'].links).to.be.empty;
    expect(r['Another fake show'].folder).to.equal('Another fake show');
    expect(r['Another fake show'].links).to.be.empty;
  });
});
