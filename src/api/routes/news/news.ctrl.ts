import express from 'express';
import feedManager from '../../../lib/feedManager';

class NewsController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      return res.json({ ok: true, message: 'list', feeds: feedManager.feeds });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
}

export default new NewsController();
