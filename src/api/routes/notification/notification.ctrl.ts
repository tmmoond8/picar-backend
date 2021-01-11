import express from 'express';
import { add } from 'date-fns';
import UserRepository from '../../../repository/UserRepository';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';
import EmotionRepository from '../../../repository/EmotionRepository';
import NotificationRepository from '../../../repository/NotificationRepository';
import { createCommentNotification, createEmotionNotification } from '../../../entity/Notification';

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
      const commentNotifications = comments.map(comment => 
        createCommentNotification(comment, articles.find(({ id }) => id === comment.articleId )?.title || ''))
        
      const emotions = await EmotionRepository().listByArticleIds(articleIds, lastLoginDate);
      const emotionNotifications = emotions.map(emotion => 
        createEmotionNotification(emotion, articles.find(({ id }) => id === emotion.articleId )?.title || ''))
      
      for (let notification of commentNotifications) {
        await NotificationRepository().save(notification);
      }

      for (let notification of emotionNotifications) {
        await NotificationRepository().save(notification);
      }

      me.lastLoginDate = (new Date()).toISOString();
      await UserRepository().save(me);
      
      const notifications = await NotificationRepository().list(me.id);
      return res.json({ ok: true, message: 'list', notifications: notifications.map(noti => noti.to()) });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };


  public checkViews = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      body: { notificationIds },
    } = req;
    try {
      await NotificationRepository().checkViews(notificationIds);
      return res.json({ ok: true, message: 'check view' });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
}

export default new NotificationController();
