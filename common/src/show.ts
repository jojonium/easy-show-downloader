/** Represents one show being tracked. */
export class Show {
  /**
   * @param {string} folder The folder to download the show to.
   * @param {RegExp} regex A regular expression for matching torrent names.
   * @param {string?} feedUrl An RSS feed URL that provides torrents for this
   * show. If omitted, we try every RSS feed the server knows about until the
   * first matching torrent is found.
   */
  public constructor(
    public folder: string,
    public regex: RegExp = new RegExp(folder),
    public feedUrl?: string | undefined,
  ) {}

  /**
   * @return {string} A JSON string containing information about this show.
   */
  public toJsonString(): string {
    return JSON.stringify({
      folder: this.folder,
      regex: this.regex.source,
      feedUrl: this.feedUrl ?? null,
    });
  }

  /**
   * @param {string} s Stringified JSON representation of a Show.
   * @return {Show}
   */
  public static fromJsonString(s: string): Show {
    const o = JSON.parse(s);
    if (o['folder'] === undefined) {
      throw new Error(`Error parsing folder: "${o['folder']}"`);
    }
    return new Show(
      o['folder'],
      new RegExp(o['regex'] ?? o['folder']),
      o['feedUrl'] ?? undefined,
    );
  }
}
