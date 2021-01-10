import express from 'express';
import { add } from 'date-fns';
import UserRepository from '../../../repository/UserRepository';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';
import { createCommentNotification } from '../../../entity/Notification';

class NotificationController {

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      body: { user },
    } = req;
    try {
      const me = await UserRepository().getByCode(user.profile.code);
      if (!me) {
        return res.json({ ok: false, message: 'not found' });
      }
      const sevenDaysAgo = add(new Date(), { days: -7 }).toISOString();
      const articles = await ArticleRepository().listByCode(user.profile.code, { startAt: sevenDaysAgo });
      const articleIds = articles.map(article => article.id);
      const lastLoginDate = me.lastLoginDate || sevenDaysAgo;
      const comments = await CommentRepository().listByArticleIds(articleIds, lastLoginDate);
      
      const commentNotifications = comments.map(comment => createCommentNotification(comment, articles.find(({ id }) => id === comment.articleId )?.title || ''))
      // console.log(commentNotifications);
      // const commentsPromise = CommentRepository().listAll(lastLoginDate);
      // console.log(articles);
      const notifications = [...commentNotifications.map(c => c.to())];

      return res.json({ ok: true, message: 'list', notifications });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
}

export default new NotificationController();
