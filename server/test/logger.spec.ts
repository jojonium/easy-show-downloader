import {logger} from '../src/logger';
import chai, {expect} from 'chai';
import fs from 'fs';
import chaiAsPromised from 'chai-as-promised';
import {config} from '../src/config';
chai.use(chaiAsPromised);

describe('Logger', () => {
  const oldLogStdout = config.LOG_STDOUT;
  const oldLogFile = config.LOG_FILE;

  after(() => {
    // Return logger to its original settings.
    config.LOG_STDOUT = oldLogStdout;
    config.LOG_FILE = oldLogFile;
  });

  describe('#log()', () => {
    before(() => {
      config.LOG_STDOUT = false;
      config.LOG_FILE = undefined;
    });

    it('Should include a current ISO timestamp', async () => {
      expect(await logger.log('Test')).to.contain(
          new Date().toISOString().substring(0, 19),
      );
    });

    it('Should default to "INFO" level', async () => {
      expect(await logger.log('Test')).to.contain('[INFO]');
    });

    describe('Logging to a file', () => {
      const logFileName = 'output.log';

      beforeEach(async () => {
        await fs.promises.rm(logFileName, {force: true});
        config.LOG_STDOUT = false;
        config.LOG_FILE = logFileName;
      });

      after(async () => {
        await fs.promises.rm(logFileName, {force: true});
      });

      it('Should create a new file if one doesn\'t yet exist', async () => {
        // Make sure the file doesn't exist yet.
        await expect(fs.promises.stat(logFileName)).to.be.rejectedWith(Error);

        const d = new Date();
        await logger.log('Test');
        expect((await fs.promises.readFile(logFileName)).toString()).to.match(
            new RegExp(
                `^${d.toISOString().substring(0, 16)}.* \\[INFO\\] Test\\n$`,
            ),
        );
      });

      it('Should append lines to an existing file', async () => {
        await logger.log('Another');
        await logger.log('And another');
        expect(
            (await fs.promises.readFile(logFileName)).toString().split('\n')
                .length,
        ).to.equal(3);
      });
    });
  });
});
