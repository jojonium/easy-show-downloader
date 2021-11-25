import {logger} from '../src/logger';
import chai, {expect} from 'chai';
import fs from 'fs';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('Logger', () => {
  after(() => {
    // Return logger to its default settings.
    logger.stdout = true;
    logger.outFile = undefined;
  });

  describe('#log()', () => {
    before(() => {
      logger.stdout = false;
      logger.outFile = undefined;
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
        logger.stdout = false;
        logger.outFile = logFileName;
      });

      after(async () => {
        await fs.promises.rm(logFileName, {force: true});
      });

      it('Should create a new file if one doesn\'t yet exist', async () => {
        // Make sure the file doesn't exist yet.
        await expect(fs.promises.stat(logFileName)).to.be.rejectedWith(Error);

        const d = new Date();
        await logger.log('Test');
        expect((await fs.promises.readFile(logFileName)).toString()).to.equal(
            `${d.toISOString()} [INFO] Test\n`,
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
