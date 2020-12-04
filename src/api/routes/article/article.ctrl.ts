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
      if (article) {
        res.json({
          ok: true,
          message: 'get',
          data: article.to(),
        });
      } else {
        res.json({
          ok: false,
          message: 'get',
        });
      }
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
      res.json({ ok: true, message: 'list', articles: articles.map(article => article.to()) });
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
      res.json({ ok: true, message: 'write', article: article.to() });
    } catch (error) {
      next(error);
    }

    res.json({ ok: true, message: 'write' });
  };

  public remove = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      body: { user },
      params: { id },
    } = req;
    try {
      const article = await ArticleRepository().get(id);
      if (article) {
        console.log(user.profile);
        console.log(article.authorId);
        if (user.profile.id === article.authorId)  {
          await ArticleRepository().remove(parseInt(id));
          res.json({
            ok: true,
            message: 'removed',
          });
        } else {
          res.json({
            ok: false,
            message: 'not authorized',
          });
        }
      } else {
        res.json({
          ok: false,
          message: 'not found',
        });
      }
    } catch(error) {
      next(error);
    }
  }
}

export default new ArticleController();
