import {Show} from '@easy-show-downloader/common/dist/show';
import {expect} from 'chai';
import express from 'express';
import {Server} from 'http';
import {config} from '../src/config';
import {app, shutDown} from '../src/index';
import {resolveTorrents} from '../src/resolve-torrents';

describe('resolveTorrents()', () => {
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

  it('Should resolve multiple matching links from one feed', async () => {
    const data = {
      shows: [new Show('Dragon Quest')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const links = await resolveTorrents(data);
    expect(links).to.have.lengthOf(7);
    expect(links[0]).to.deep.equal({
      link: 'https://nyaa.si/download/1460617.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[1]).to.deep.equal({
      link: 'https://nyaa.si/download/1460612.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[2]).to.deep.equal({
      link: 'https://nyaa.si/download/1460611.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[3]).to.deep.equal({
      link: 'https://nyaa.si/download/1460610.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[4]).to.deep.equal({
      link: 'https://nyaa.si/download/1460609.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[5]).to.deep.equal({
      link: 'https://nyaa.si/download/1460607.torrent',
      folder: 'Dragon Quest',
    });
    expect(links[6]).to.deep.equal({
      link: 'https://nyaa.si/download/1460606.torrent',
      folder: 'Dragon Quest',
    });
  });

  it('Should handle more complex regular expressions', async () => {
    const data = {
      shows: [new Show('Dragon Quest', /Dragon Quest.*1080p/, 'Folder Name')],
      rssUrls: [`http://${config.HOST}:${config.PORT}/test-rss-1.xml`],
    };
    const links = await resolveTorrents(data);
    expect(links).to.have.lengthOf(3);
    expect(links[0].link).to.equal(
        'https://nyaa.si/download/1460617.torrent',
    );
    expect(links[1].link).to.equal(
        'https://nyaa.si/download/1460612.torrent',
    );
    expect(links[2].link).to.equal(
        'https://nyaa.si/download/1460610.torrent',
    );
    expect(links.every(({folder}) => folder === 'Folder Name'));
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
    const links = await resolveTorrents(data);
    expect(links).to.deep.include({
      folder: 'Shin Tetsujin 28-gou',
      link: 'https://correct-link-test',
    });
  });

  it('Should return empty list if no matches found', async () => {
    const data = {
      shows: [new Show('Fake show'), new Show('Another fake show')],
      rssUrls: [
        `http://${config.HOST}:${config.PORT}/test-rss-2.xml`,
        `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
      ],
    };
    const links = await resolveTorrents(data);
    expect(links).to.be.empty;
  });

  it(
      'Should still resolve torrents from successful feeds if one feed fails',
      async () => {
        const data = {
          shows: [new Show('Shin Tetsujin 28-gou')],
          rssUrls: [
            `http://${config.HOST}:${config.PORT}/fake-url-404.xml`,
            `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
          ],
        };
        const links = await resolveTorrents(data);
        expect(links).to.have.lengthOf(1);
      },
  );

  it('Should gracefully return an empty list if all feeds fail', async () => {
    const data = {
      shows: [new Show('Dragon Quest')],
      rssUrls: [
        `http://${config.HOST}:${config.PORT}/fake-url-404.xml`,
        `http://${config.HOST}:${config.PORT}/another-fake-url-404.xml`,
        `http://${config.HOST}:${config.PORT}/this-one-will-fail.xml`,
      ],
    };
    const links = await resolveTorrents(data);
    expect(links).to.be.empty;
  });

  it(
      'Should handle empty "title" fields by falling back to the folder' +
    ' as unique identifier',
      async () => {
        const data = {
          shows: [
            new Show('', /Dragon Quest.*NVENC.*1080p/, 'Dragon Quest/S02'),
          ],
          rssUrls: [
            `http://${config.HOST}:${config.PORT}/test-rss-1.xml`,
          ],
        };
        const links = await resolveTorrents(data);
        expect(links).to.deep.equal([{
          folder: 'Dragon Quest/S02',
          link: 'https://nyaa.si/download/1460617.torrent',
        }]);
      });

  it(
      'Sould find magnet links in fields other than <link>',
      async () => {
        const data = {
          shows: [
            new Show(
                '',
                /^Engineering Catastrophes S07E\d+.*1080p.*/,
                'Engineering Catastrophes',
            ),
          ],
          rssUrls: [
            `http://${config.HOST}:${config.PORT}/test-rss-3.xml`,
          ],
        };
        const links = await resolveTorrents(data);
        expect(links).to.deep.equal([{
          folder: 'Engineering Catastrophes',
          // eslint-disable-next-line max-len
          link: 'magnet:?xt=urn:btih:CB934F52DCC2720860187075008904D5F36E244D&dn=Engineering.Catastrophes.S07E05.1080p.WEB.h264-DUHSCOVERY%5Beztv.re%5D.mkv&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftorrent.gresille.org%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337',
        }]);
      });
});
