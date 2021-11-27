import {app as server, shutDown} from '../src/index';
import fs from 'fs';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config';
import {writeDataFile} from '../src/fs-helper';
import {Data} from '../src/data';
import {Show} from '@easy-show-downloader/common/dist/show';

chai.use(chaiHttp);

describe('GET /api/data', () => {
  const fileName = 'get-data-test.json';
  const oldFileName = config.DATA_FILE;
  const oldLogStdout = config.LOG_STDOUT;

  before(() => {
    config.DATA_FILE = fileName;
    config.LOG_STDOUT = false;
  });

  after(async () => {
    shutDown();
    config.DATA_FILE = oldFileName;
    config.LOG_STDOUT = oldLogStdout;
  });

  afterEach(async () => {
    await fs.promises.rm(fileName, {force: true});
  });

  it('Should return an empty data object if no data file exists', async () => {
    await fs.promises.rm(fileName, {force: true});

    const res = await chai.request(server).get('/api/data');
    expect(res).to.have.status(200);
    expect(res).to.have.header('Content-Type', /application\/json/);
    expect(res.body['shows']).to.be.an('array');
    expect(res.body['shows']).to.have.lengthOf(0);
    expect(res.body['rssUrls']).to.be.an('array');
    expect(res.body['rssUrls']).to.have.lengthOf(0);
  });

  it('Should return an error message for a malformed data file', async () => {
    await fs.promises.writeFile(fileName, 'jasid:fj}ds');

    const res = await chai.request(server).get('/api/data');
    expect(res).to.have.status(500);
    expect(res).to.have.header('Content-Type', /application\/json/);
    expect(res.body['statusCode']).to.equal(500);
    expect(res.body['message']).to.be.a('string');
  });

  it('Should successfully return a data object', async () => {
    const data: Data = {
      shows: [
        new Show(
            'asdf',
            /asdf.*1080p/,
            'asdf/Season 01',
        ),
        new Show('Mobile Suit Zeta Gundam'),
      ],
      rssUrls: [
        'https://example.com/a',
        'http://example.org/rss.xml',
      ],
    };
    await writeDataFile(fileName, data);

    const res = await chai.request(server).get('/api/data');
    expect(res).to.have.status(200);
    expect(res).to.have.header('Content-Type', /application\/json/);
    expect(res.body['shows']).to.be.an('array');
    expect(res.body['shows']).to.have.lengthOf(2);
    expect(res.body['shows'][1].folder).to.equal('Mobile Suit Zeta Gundam');
    expect(res.body['rssUrls']).to.be.an('array');
    expect(res.body['rssUrls']).to.have.lengthOf(2);
  });
});
