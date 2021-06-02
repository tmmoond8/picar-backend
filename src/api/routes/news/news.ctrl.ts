import express from 'express';
import feedManager from '../../../lib/feedManager';

class NewsController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      if (feedManager.feeds.length === 0) {
        await feedManager.init();
      }
      const news = feedManager.feeds.sort((a, b) => {
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
