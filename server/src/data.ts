import {Show} from '../../common/src/show';

/**
 * Contains all the data the server knows about shows and RSS sources.
 */
export type Data = {
  shows: Show[];
  rssUrls: string[];
}
