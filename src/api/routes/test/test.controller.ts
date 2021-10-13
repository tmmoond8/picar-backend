import express from 'express';
import Article from '../../../entity/Article';
import { ArticleRepository } from '../../../entity/Article';

class TestController {
  public getTest = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const article = await ArticleRepository()
        .createQueryBuilder('article')
        .where('article.id = :articleId', { articleId: 67 })
        .getOne();

      await ArticleRepository()
        .createQueryBuilder()
        .update(Article)
        .set({ commentCount: () => 'commentCount + 1' })
        .where('article.id = :articleId', { articleId: 67 })
        .execute();
    } catch (error) {}
    res.json({ ok: true, message: 'getTest' });
  };

  public postTest = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'postTest' });
  };

  public log = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    console.log('log', JSON.stringify(body));
    res.json({ ok: true, body: JSON.stringify(body) });
  };
}

export default new TestController();
