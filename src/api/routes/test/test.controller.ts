import express from 'express';
import { ArticleRepository } from '../../../entity/Article';

class TestController {
  public getTest = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const article = await ArticleRepository()
      .createQueryBuilder('article')
      .where('article.id = :articleId', { articleId: 67 })
      .getOne();

      if (article) {
        article.commentCount = article.commentCount + 1;
        await ArticleRepository().save(article, {
          transaction: false,
        })
      }
    } catch (error) {

    }
    res.json({ ok: true, message: 'getTest' });
  }

  public postTest = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.json({ ok: true, message: 'postTest' });
  }
};

export default new TestController();