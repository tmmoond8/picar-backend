import express from 'express';
import LruChache from 'lru-cache';
import { NewsFeed } from '../../../types/NewsFeed';
import spreadSheets from '../../../lib/spreadSheet';

const cache = new LruChache<string, any>({
  max: 1000,
  maxAge: 1000 * 60 * 60 * 2, // 2시간
})


class NewsController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      let feeds: NewsFeed[] = cache.get("feeds");
      if (!feeds) {
        const { data: { data } } = await spreadSheets.get();
        feeds = data;
        cache.set("feeds", data);
      }
      const news = feeds.sort((a, b) => {
        return new Date(a.pubDate).getTime() > new Date(b.pubDate).getTime() ? -1 : 1
      });
      return res.json({ ok: true, message: 'list', news });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
}

export default new NewsController();
