import express from 'express';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';

class TestController {
  public getTest = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
      
    try {
      const comments = await CommentRepository().all();
      const commentCounts = comments.reduce((accum, comment) => {
        if (comment.about) return accum;
        accum[comment.articleId.toString()] = (accum[comment.articleId.toString()] || 0) + 1;
        return accum;
      }, {} as any)
      const articles = await ArticleRepository().list()
      articles.forEach(article => {
        if (article.id in commentCounts) {
          article.commentCount = commentCounts[article.id];
          ArticleRepository().save(article);
        }
      })
      
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