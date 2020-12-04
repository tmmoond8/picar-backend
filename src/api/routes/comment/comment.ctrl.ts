import express from 'express';
import { getConnection } from 'typeorm';
import User from '../../../entity/User';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';

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
      const Allcomments = await CommentRepository().list(articleId);
      const comments = Allcomments.filter(comment => !comment.about).reduce((accum: any, comment) => {
        accum[comment.id] = { ...comment.to(), replies: []};
        return accum;
      }, {})
      const replies = Allcomments.filter(comment => comment.about);

      replies.forEach(reply => {
        comments[reply.about].replies.push(reply.to());
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
      await CommentRepository().save(comment);
      if (!body.about) {
        console.log('up', body.articleId)
        await ArticleRepository().increaseComment(body.articleId);
      }
      res.json({ ok: true, message: 'write', comment: comment.to() });
    } catch (error) {
      next(error);
    }
  };
}

export default new CommentController();
