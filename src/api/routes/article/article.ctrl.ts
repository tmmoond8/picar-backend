import express from 'express';
import { getConnection } from 'typeorm';
import { add, differenceInDays } from 'date-fns';
import Article from '../../../entity/Article';
import User from '../../../entity/User';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';
import EmotionRepository from '../../../repository/EmotionRepository';
import BookmarkRepository from '../../../repository/BookmarkRepository';

class ArticleController {

  public last = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const article = await ArticleRepository().last()
      if (article) {
        return res.json({
          ok: true,
          message: 'get',
          data: article,
        });
      } else {
        return res.json({
          ok: false,
          message: 'get',
        });
      }
    } catch (error) {
      next(error);
    }
    return res.json({ ok: false, message: 'get' });
  }

  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { id },
    } = req;
    try {
      const article = await ArticleRepository().get(id);
      if (article) {
        return res.json({
          ok: true,
          message: 'get',
          data: article.to(),
        });
      } else {
        return res.json({
          ok: false,
          message: 'get',
        });
      }
    } catch (error) {
      next(error);
    }
    return res.json({ ok: true, message: 'get' });
  };

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      query,
    } = req;
    try {
      const articles = await ArticleRepository().list(query);
      return res.json({ ok: true, message: 'list', articles: articles.map(article => article.to()) });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: true, message: 'list' });
  };

  public listByCode = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { code },
    } = req;
    try {
      const articles = await ArticleRepository().listByCode(code);
      return res.json({ ok: true, message: 'list', articles: articles.map(article => article.to()) });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: true, message: 'list' });
  };

  public listBookmark = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { query } = req;
    try {
      const articleIds = JSON.parse(query.articleIds?.toString() ?? '[]');
      if (!Array.isArray(articleIds)) {
        throw Error('Parameter error');
      }
      const articles = await ArticleRepository().listBookmark(articleIds);
      return res.json({ ok: true, message: 'list', articles: articles.map(article => article.to()) });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: true, message: 'list' });
  };


  public listPopular = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const COUNTER = {
      COMMENT: 1,
      EMOTION: 1,
      BOOKMARK: 3,
    }
    try {
      const startAt = add(new Date(), { days: -30 }).toISOString();
      const articlesPromise = ArticleRepository().list({ startAt });
      const commentsPromise = CommentRepository().listAll(startAt);
      const emotionsPromise = EmotionRepository().listAll(startAt);
      const bookmarksPromise = BookmarkRepository().listAll(startAt);

      const articles = await articlesPromise;
      const comments = await commentsPromise;
      const emotions = await emotionsPromise;
      const bookmarks = await bookmarksPromise;

      const counterMap = new Map<number, number>()
      const getFreshness = ((today: Date) => (createAt: string) => 1 / differenceInDays(today, new Date(createAt)))((new Date()))

      comments.forEach(comment => {
        const commentValue = (counterMap.get(comment.articleId) ?? 0) + COUNTER.COMMENT * getFreshness(comment.createAt);
        counterMap.set(comment.articleId, commentValue);
      });

      emotions.forEach(emotion => {
        const emotionValue = (counterMap.get(emotion.articleId) ?? 0) + COUNTER.EMOTION * getFreshness(emotion.createAt);
        counterMap.set(emotion.articleId, emotionValue);
      })

      bookmarks.forEach(bookmark => {
        const bookmarkValue = (counterMap.get(bookmark.articleId) ?? 0) + COUNTER.BOOKMARK * getFreshness(bookmark.createAt);
        counterMap.set(bookmark.articleId, bookmarkValue);
      })
      const counter = Array.from(counterMap);

      counter.sort(([_, a], [__, b]) => a < b ? 1 : -1);
      const popArticles: Article[] = []

      counter.forEach(([articleId, value]) => {
        const found = articles.find((article) => article.id === articleId);
        if (found) {
          popArticles.push(found);
        }
      })

      return res.json({ ok: true, message: 'list', articles: popArticles });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: false, message: 'list' });
  };

  public search = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      query,
    } = req;
    try {
      const articles = await ArticleRepository().search(query);
      return res.json({ ok: true, message: 'list', articles: articles.map(article => article.to()) });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: false, message: 'list' });
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
      const article = user!.createArticle();
      article!.title = body.title;
      article!.content = body.content;
      article!.group = body.group;
      article!.photos = body.photos;
      article!.thumbnail = body.thumbnail;
      await ArticleRepository().save(article);
      return res.json({ ok: true, message: 'write', article: article.to() });
    } catch (error) {
      next(error);
    }

    return res.json({ ok: true, message: 'write' });
  };

  public update = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body, params: { articleId },
    } = req;
    try {
      const article = await ArticleRepository().get(articleId);
      if (article) {
        if (body.user.profile.id === article.authorId) {
          article.title = body.title;
          article.content = body.content;
          article.group = body.group;
          article.photos = body.photos;
          article!.thumbnail = body.thumbnail
          await ArticleRepository().save(article);
          return res.json({
            ok: true,
            message: 'updated',
            article: article.to()
          });
        } else {
          return res.json({
            ok: false,
            message: 'not authorized',
          });
        }
      } else {
        return res.json({
          ok: false,
          message: 'not found',
        });
      }
    } catch (error) {
      next(error);
    }

    return res.status(500);
  };

  public remove = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      body: { user },
      params: { articleId },
    } = req;
    try {
      const article = await ArticleRepository().get(articleId);
      if (article) {
        if (user.profile.id === article.authorId) {
          await ArticleRepository().remove(parseInt(articleId));
          return res.json({
            ok: true,
            message: 'removed',
          });
        } else {
          return res.json({
            ok: false,
            message: 'not authorized',
          });
        }
      } else {
        return res.json({
          ok: false,
          message: 'not found',
        });
      }
    } catch (error) {
      next(error);
    }
    return res.status(500);
  }
}

export default new ArticleController();
