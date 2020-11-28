import express from 'express';
import EmotionRepository from '../../../repository/EmotionRepository';

class EmotionController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { articleId },
    } = req;
    try {
      const emotions = await EmotionRepository().list(articleId);
      res.json({ ok: true, message: 'list', emotions });
    } catch (error) {
      next(error);
    }
  };

  public add = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    try {
      await EmotionRepository().add({
        articleId: body.articleId,
        authorId: '0f13e37e-0849-42b5-8d70-b44a4499335e',
        emotion: body.emotion,
      })
      res.json({ ok: true, message: 'emotion add' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    
    try {
      await EmotionRepository().delete({
        articleId: body.articleId,
        authorId: '0f13e37e-0849-42b5-8d70-b44a4499335e',
      })
      res.json({ ok: true, message: 'emotion delete' });
    } catch (error) {
      next(error);
    }
  };
}

export default new EmotionController();
