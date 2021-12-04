import {Show} from '../src/show';
import {expect} from 'chai';

describe('Show', () => {
  describe('#constructor', () => {
    it('Should use a simple default regex', () => {
      const s = new Show('Neon Genesis Evangelion');
      expect(s.regex.toString()).to.equal(
        new RegExp('Neon Genesis Evangelion').toString(),
      );
    });

    it('Should use the show name as the default folder name', () => {
      const s = new Show('abc', /def/);
      expect(s.folder).to.equal('abc');
    });

    it('Should optionally take a preferred RSS feed URL', () => {
      const s1 = new Show('Space Dandy');
      expect(s1.feedUrl).to.be.undefined;
      const s2 = new Show(
        'Space Dandy',
        new RegExp('Space Dandy'),
        'Space Dandy/Season 02',
        'https://example.com',
      );
      expect(s2.feedUrl).to.equal('https://example.com');
    });
  });

  describe('#toJsonString()', () => {
    const s = new Show(
      'Cowboy Bebop',
      /^Cowboy Bebop.*$/,
      'A random folder',
      'https://example.com/rss.xml',
    );

    it('Should produce a one-line string', () => {
      expect(s.toJsonString()).to.be.a('string');
      expect(s.toJsonString().split('\n').length).to.equal(1);
    });

    it('Should produce a parsable JSON string', () => {
      expect(JSON.parse(s.toJsonString())).to.be.an('object');
      expect(JSON.parse(s.toJsonString()))
        .to.haveOwnProperty('title')
        .equal('Cowboy Bebop');
      expect(JSON.parse(s.toJsonString()))
        .to.haveOwnProperty('regex').equal('^Cowboy Bebop.*$');
    });

    it('Should store regular expressions without slashes', () => {
      expect(JSON.parse(s.toJsonString())['regex']).to.equal(
        '^Cowboy Bebop.*$',
      );
    });
  });

  describe('#fromJsonString()', () => {
    it('Should correctly parse a title alone', () => {
      const s = Show.fromJsonString('{"title": "Mobile Suit Gundam"}');
      expect(s.title).to.equal('Mobile Suit Gundam');
      expect(s.regex.source).to.equal('Mobile Suit Gundam');
      expect(s.folder).to.equal('Mobile Suit Gundam');
      expect(s.feedUrl).to.be.undefined;
    });

    it('Should correctly parse the output of toJsonString()', () => {
      let str = new Show(
        'FLCL',
        /^FLCL.*1080p.*$/,
        'FLCL',
        'https://example.com/rss.xml',
      ).toJsonString();
      let s = Show.fromJsonString(str);
      expect(s.title).to.equal('FLCL');
      expect(s.regex.source).to.equal('^FLCL.*1080p.*$');
      expect(s.folder).to.equal('FLCL');
      expect(s.feedUrl).to.equal('https://example.com/rss.xml');

      str = new Show(
        'FLCL',
        /^FLCL.*1080p.*$/,
        'FLCL',
      ).toJsonString();
      s = Show.fromJsonString(str);
      expect(s.title).to.equal('FLCL');
      expect(s.regex.source).to.equal('^FLCL.*1080p.*$');
      expect(s.folder).to.equal('FLCL');
      expect(s.feedUrl).to.be.undefined;

      str = new Show(
        'FLCL',
        /^FLCL.*1080p.*$/,
      ).toJsonString();
      s = Show.fromJsonString(str);
      expect(s.title).to.equal('FLCL');
      expect(s.regex.source).to.equal('^FLCL.*1080p.*$');
      expect(s.folder).to.equal('FLCL');
      expect(s.feedUrl).to.be.undefined;

      str = new Show('FLCL').toJsonString();
      s = Show.fromJsonString(str);
      expect(s.title).to.equal('FLCL');
      expect(s.regex.source).to.equal('FLCL');
      expect(s.folder).to.equal('FLCL');
      expect(s.feedUrl).to.be.undefined;
    });
  });
});
