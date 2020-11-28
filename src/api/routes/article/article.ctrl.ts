import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import ArticleRepository from '../../../repository/ArticleRepository';

class ArticleController {

  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { id },
    } = req;
    try {
      const article = await ArticleRepository().get(id);
      res.json({
        ok: true,
        message: 'get',
        data: article,
      });
    } catch (error) {
      next(error);
    }
    res.json({ ok: true, message: 'get' });
  };

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      query: { group },
    } = req;
    try {
      const articles = await ArticleRepository().list(!!group ? group.toString() : '');
      res.json({ ok: true, message: 'list', articles });
    } catch (error) {
      next(error);
    }

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
        .findOne({ code: body.user.profile.code });
      const article = user!.createArticle();
      article!.title = body.title;
      article!.content = body.content;
      article!.group = body.group;
      article!.photos = body.photos;
      await ArticleRepository().save(article);
      res.json({ ok: true, message: 'write', article });
    } catch (error) {
      next(error);
    }

    res.json({ ok: true, message: 'write' });
  };
}

export default new ArticleController();
