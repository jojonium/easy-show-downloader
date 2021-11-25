/** Represents one show being tracked. */
export class Show {
  /**
   * @param {string} title The title of the show.
   * @param {RegExp} regex A regular expression for matching torrent names.
   * @param {string} folder The name of the folder to save episodes in.
   * Defaults to title.
   */
  public constructor(
    public title: string,
    public regex: RegExp = new RegExp(title),
    public folder: string = title,
  ) {}
}
