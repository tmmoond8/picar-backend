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
      const image = await getOgImage(feed.link);
      feed.thumbnail = image;
      this.feeds.push(feed);
      this.existedSet.add(feed.id);
      spreadSheets.append(feed);
    }
  }

  appendAll(feeds: NewsFeed[]) {
    const queues = [...feeds];
    const appendSheet = async () => {
      const q = queues.pop();
      if (q) {
        this.append(q);
        setTimeout(() => {
          appendSheet();
        }, 5000)
      }
    }
    appendSheet();
  }
}

export default new FeedManager();