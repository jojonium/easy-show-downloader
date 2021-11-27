import {app as server, shutDown} from '../src/index';
import fs from 'fs';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config';

chai.use(chaiHttp);

describe('GET /data', () => {
  const fileName = 'get-health-test.json';
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

  it('Should normally return 200', async () => {
    const res = await chai.request(server).get('/health');
    expect(res).to.have.status(200);
  });

  it('Should return a 500 if data file is unreadable', async () => {
    await fs.promises.writeFile(fileName, 'ai0bj3n1');
    const res = await chai.request(server).get('/data');
    expect(res).to.have.status(500);
    await fs.promises.rm(fileName, {force: true});
  });
});
