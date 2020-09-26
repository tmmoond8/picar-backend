import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import Article, { ArticleRepository } from '../../../entity/Article';
// import { UserRepository } from '../../../entity/User';

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
      const article = await ArticleRepository()
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where('article.id = :id', { id: Number(id) })
        .getOne();
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
    try {
      const articles = await ArticleRepository().find();
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
        .findOne({ name: 'kaka' });
      const article = user!.createArticle();
      article!.title = body.title;
      article!.content = body.content;
      article!.group = body.group;
      await getConnection().getRepository(Article).save(article);
      res.json({ ok: true, message: 'write', article });
    } catch (error) {
      next(error);
    }

    res.json({ ok: true, message: 'write' });
  };
}

export default new ArticleController();
