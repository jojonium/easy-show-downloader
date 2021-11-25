/** Represents one show being tracked. */
export class Show {
  /**
   * @param {string} title The title of the show.
   * @param {RegExp} regex A regular expression for matching torrent names.
   * @param {string} folder The name of the folder to save episodes in.
   * Defaults to title.
   * @param {string?} feedUrl An RSS feed URL that provides torrents for this
   * show. If omitted, we try every RSS feed the server knows about until the
   * first matching torrent is found.
   */
  public constructor(
    public title: string,
    public regex: RegExp = new RegExp(title),
    public folder: string = title,
    public feedUrl?: string | undefined,
  ) {}

  /**
   * @return {string} A JSON string containing information about this show.
   */
  public toJsonString(): string {
    return JSON.stringify({
      title: this.title,
      regex: this.regex.source,
      folder: this.folder,
      feedUrl: this.feedUrl ?? null,
    });
  }

  /**
   * @param {string} s Stringified JSON representation of a Show.
   * @return {Show}
   */
  public static fromJsonString(s: string): Show {
    const o = JSON.parse(s) as {[key: string]: any};
    if (o['title'] === undefined) {
      throw new Error(`Error parsing title: "${o['title']}"`);
    }
    return new Show(
        o['title'],
        new RegExp(o['regex'] ?? o['title']),
        o['folder'],
        o['feedUrl'] ?? undefined,
    );
  }
}
