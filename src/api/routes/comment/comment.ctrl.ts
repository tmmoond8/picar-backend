import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import Comment, { CommentRepository } from '../../../entity/Comment';
import ArticleRepository from '../../../repository/ArticleRepository';

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
      const Allcomments = await CommentRepository()
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'user')
        .where('comment.articleId = :articleId', { articleId })
        .orderBy("comment.createAt", "ASC")
        .getMany();

      const comments = Allcomments.filter(comment => !comment.about).reduce((accum: any, comment) => {
        accum[comment.id] = { ...comment, replies: []};
        return accum;
      }, {})
      const replies = Allcomments.filter(comment => comment.about);

      replies.forEach(reply => {
        comments[reply.about].replies.push(reply);
      })
      res.json({ ok: true, message: 'list', comments: Object.values(comments) });
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
    try {
      const user = await getConnection()
        .getRepository(User)
        .findOne({ code: body.user.profile.code });
      const comment = user!.createComment(body.articleId);
      comment!.content = body.content;
      if (body.about) {
        comment!.about = body.about || null;
      } else {
        comment!.replies = [];
      }
      await getConnection().getRepository(Comment).save(comment);
      if (!body.about) {
        console.log('up', body.articleId)
        await ArticleRepository().increaseComment(body.articleId);
      }
      res.json({ ok: true, message: 'write', comment });
    } catch (error) {
      next(error);
    }
  };
}

export default new CommentController();
