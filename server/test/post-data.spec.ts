import {app as server, shutDown} from '../src/index';
import fs from 'fs';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config';
import {readDataFile, writeDataFile} from '../src/fs-helper';
import {Show} from '@easy-show-downloader/common/dist/show';
import {stringifyData} from '@easy-show-downloader/common/src/data';

chai.use(chaiHttp);

describe('POST /api/data', () => {
  const fileName = 'post-data-test.json';
  const oldFileName = config.DATA_FILE;
  const oldLogStdout = config.LOG_STDOUT;

  before(() => {
    config.DATA_FILE = fileName;
    config.LOG_STDOUT = false;
  });

  after(() => {
    shutDown();
    config.DATA_FILE = oldFileName;
    config.LOG_STDOUT = oldLogStdout;
  });

  it('Should successfully write a data file', async () => {
    await fs.promises.rm(fileName, {force: true});
    const toSend = stringifyData({
      shows: [],
      rssUrls: ['asdf'],
    });
    const res = await chai
        .request(server)
        .post('/api/data')
        .send(JSON.parse(toSend));
    expect(res).to.have.status(200);
    const written = await readDataFile(fileName);
    expect(written.shows).to.be.empty;
    expect(written.rssUrls).to.have.lengthOf(1);
    await fs.promises.rm(fileName, {force: true});
  });

  it('Should successfully overwrite an existing file', async () => {
    await writeDataFile(fileName, {
      shows: [new Show('Old Show')],
      rssUrls: [],
    });
    const res = await chai
        .request(server)
        .post('/api/data')
        .send(JSON.parse(stringifyData({
          shows: [
            new Show('New Show', undefined),
            new Show(
                'Only on Nyaa',
                undefined,
                'https://nyaa.se',
            ),
          ],
          rssUrls: ['https://example.com', 'https://nyaa.se'],
        })));
    expect(res).to.have.status(200);
    const written = await readDataFile(fileName);
    expect(written.shows).to.have.lengthOf(2);
    expect(written.shows[0]?.folder).to.equal('New Show');
    expect(written.shows[0]?.regex.source).to.equal('New Show');
    expect(written.shows[1]?.folder).to.equal('Only on Nyaa');
    expect(written.shows[1]?.feedUrl).to.equal('https://nyaa.se');
    expect(written.rssUrls).to.have.lengthOf(2);
    expect(written.rssUrls[0]).to.equal('https://example.com');
    expect(written.rssUrls[1]).to.equal('https://nyaa.se');
    await fs.promises.rm(fileName, {force: true});
  });

  it('Should return a 400 error on invalid input', async () => {
    const res = await chai
        .request(server)
        .post('/api/data')
        .send({
          shows: [
            {test: 'wrong'},
            new Show('Only on Nyaa', undefined, 'https://nyaa.se'),
          ],
          rssUrls: ['https://example.com', 'https://nyaa.se'],
        });
    expect(res).to.have.status(400);
    const file = await readDataFile(fileName);
    expect(file.shows).to.be.empty;
    expect(file.rssUrls).to.be.empty;
  });
});
