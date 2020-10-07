import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import Comment, { CommentRepository } from '../../../entity/Comment';

class CommentController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { articleId },
    } = req;
    try {
      const comments = await CommentRepository()
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'user')
        .where('comment.articleId = :articleId', { articleId })
        .getMany();
      res.json({ ok: true, message: 'list', comments });
    } catch (error) {
      next(error);
    }
  };

  public write = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    console.log(body);
    try {
      const user = await getConnection()
        .getRepository(User)
        .findOne({ name: 'kaka' });
      const comment = user!.createComment(body.articleId);
      comment!.content = body.content;
      await getConnection().getRepository(Comment).save(comment);
      res.json({ ok: true, message: 'write', comment });
    } catch (error) {
      next(error);
    }
  };
}

export default new CommentController();
