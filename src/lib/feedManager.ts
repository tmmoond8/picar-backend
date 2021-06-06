import { NewsFeed } from '../types/NewsFeed';
import spreadSheets from './spreadSheet';
import { getOgImage } from './fetchOgTag';

class FeedManager {
  existedSet: Set<string> = new Set();
  feeds: NewsFeed[] = [];

  async init() {
    const { data: { data } } = await spreadSheets.get();
    this.feeds = data;
    this.existedSet = new Set(data.map(({ id }) => id));
  }

  async append(feed: NewsFeed) {
    if (!this.existedSet.has(feed.id)) {
      try {
        const image = await getOgImage(feed.link);
        feed.thumbnail = image;
        await spreadSheets.append(feed);
        this.feeds.push(feed);
        this.existedSet.add(feed.id);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  async appendAll(feeds: NewsFeed[]) {
    const queues = [...feeds];
    for (let i = 0; i < queues.length; i++) {
      await this.append(queues[i]);
    }
  }
}

export default new FeedManager();