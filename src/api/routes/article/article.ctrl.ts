import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import Article from '../../../entity/Article';

class ArticleController {
  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'get' });
  };

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'list' });
  };

  public write = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    try {
      const user = await getConnection()
        .getRepository(User)
        .findOne({ name: 'kaka' });
      const article = user!.createArticle();
      article!.title = body.title;
      article!.content = body.content;
      await getConnection().getRepository(Article).save(article);
      res.json({ ok: true, message: 'write', article });
    } catch (error) {
      next(error);
    }

    res.json({ ok: true, message: 'write' });
  };
}

export default new ArticleController();
