import {Show} from '../../common/dist/show';

/**
 * Contains all the data the server knows about shows and RSS sources.
 */
export type Data = {
  shows: Show[];
  rssUrls: string[];
}
