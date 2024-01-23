import {readDataFile, writeDataFile} from '../src/fs-helper';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {Data, parseDataString} from '@easy-show-downloader/common/dist/data';
import fs from 'fs';
import {Show} from '@easy-show-downloader/common/dist/show';
chai.use(chaiAsPromised);

describe('fs-helpers', () => {
  describe('readDataFile()', () => {
    it('Should yield an empty data object when the file does not exist',
        async () => {
          const result = await readDataFile('asdfasdfasdf');
          expect(result.rssUrls).to.be.empty;
          expect(result.shows).to.be.empty;
        });

    it('Should read files written by writeDataFile()', async () => {
      const fileName = 'data.json';
      const data: Data = {
        rssUrls: ['https://example.com/rss.xml'],
        shows: [
          new Show('Gunbuster'),
          new Show('Diebuster'),
        ],
        mediaRoot: '/mnt/media',
      };
      await writeDataFile(fileName, data);
      const result = await readDataFile(fileName);
      expect(result.rssUrls).to.have.lengthOf(1);
      expect(result.rssUrls[0]).to.equal('https://example.com/rss.xml');
      expect(result.shows).to.have.lengthOf(2);
      expect(result.shows[0]?.folder).to.equal('Gunbuster');
      expect(result.shows[0]?.feedUrl).to.be.undefined;
      expect(result.shows[1]?.folder).to.equal('Diebuster');
      expect(result.mediaRoot).to.equal('/mnt/media');
      await fs.promises.rm(fileName, {force: true});
    });
  });

  describe('writeDataFile()', () => {
    const fileName = 'data.json';
    const data: Data = {
      rssUrls: ['https://example.com/rss.xml'],
      shows: [
        new Show('Gunbuster'),
        new Show('Diebuster'),
      ],
    };

    afterEach(async () => {
      await fs.promises.rm(fileName, {force: true});
    });

    it('Should write to a file', async () => {
      await writeDataFile(fileName, data);
      expect((await fs.promises.readFile(fileName)).toString())
          .to.be.a('string');
    });

    it('Should write a valid JSON string', async () => {
      await writeDataFile(fileName, data);
      expect(JSON.parse((await fs.promises.readFile(fileName)).toString()))
          .to.be.an('object');
    });
  });

  describe('parseDataString()', () => {
    it('Should throw an error for an invalid JSON string', () => {
      expect(() => parseDataString('{')).to.throw();
      expect(() => parseDataString('asl;kd{fjalsdkf')).to.throw();
    });

    it('Should return an empty data object for an empty string', () => {
      const result = parseDataString('');
      expect(result.shows).to.be.empty;
      expect(result.rssUrls).to.be.empty;
    });

    it('Should correctly parse a valid data string', () => {
      const result = parseDataString(
          '{"shows":[{"folder":"Cowboy Bebop"}],"rssUrls":["asdf.com"]}',
      );
      expect(result.rssUrls).to.have.lengthOf(1);
      expect(result.rssUrls[0]).to.equal('asdf.com');
      expect(result.shows).to.have.lengthOf(1);
      expect(result.shows[0]?.folder).to.equal('Cowboy Bebop');
    });

    it('Should throw an error with a malformed shows list', () => {
      const str1 = '{"shows":[5],"rssUrls":[]}';
      expect(() => parseDataString(str1)).to.throw();
      const str2 = '{"shows":"Wrong","rssUrls":[]}';
      expect(() => parseDataString(str2)).to.throw();
    });

    it('Should throw an error with a malformed RSS URL list', () => {
      const str1 = '{"shows":[],"rssUrls":[{}]}';
      expect(() => parseDataString(str1)).to.throw();
      const str2 = '{"shows":[],"rssUrls":"Wrong"}';
      expect(() => parseDataString(str2)).to.throw();
    });

    it('Should gracefully handle missing fields', () => {
      const result1 = parseDataString(
          '{"rssUrls":["asdf.com"]}',
      );
      expect(result1.rssUrls).to.have.lengthOf(1);
      expect(result1.rssUrls[0]).to.equal('asdf.com');
      expect(result1.shows).to.be.empty;

      const result2 = parseDataString(
          '{"shows":[{"folder":"Cowboy Bebop"}]}',
      );
      expect(result2.rssUrls).to.be.empty;
      expect(result2.shows).to.have.lengthOf(1);
      expect(result2.shows[0]?.folder).to.equal('Cowboy Bebop');
    });
  });
});
