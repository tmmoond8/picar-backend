import express from 'express';
import { getConnection } from 'typeorm';
import { add } from 'date-fns';
import Article from '../../../entity/Article';
import User from '../../../entity/User';
import ArticleRepository from '../../../repository/ArticleRepository';
import CommentRepository from '../../../repository/CommentRepository';
import EmotionRepository from '../../../repository/EmotionRepository';
import BookmarkRepository from '../../../repository/BookmarkRepository';

class ArticleController {

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
      params : { code },
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
    console.log(query);
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
      const startAt = add(new Date(), { days: -7 }).toISOString();
      const articlesPromise = ArticleRepository().list({ startAt });
      const commentsPromise = CommentRepository().listAll(startAt);
      const emotionsPromise = EmotionRepository().listAll(startAt);
      const bookmarksPromise = BookmarkRepository().listAll(startAt);

      const articles = await articlesPromise;
      const comments = await commentsPromise;
      const emotions = await emotionsPromise;
      const bookmarks = await bookmarksPromise;

      const counterMap = new Map<number, number>()

      comments.forEach(comment => {
        counterMap.set(comment.articleId, (counterMap.get(comment.articleId) ?? 0) + COUNTER.COMMENT);
      });

      emotions.forEach(emotion => {
        counterMap.set(emotion.articleId, (counterMap.get(emotion.articleId) ?? 0) + COUNTER.EMOTION);
      })

      bookmarks.forEach(bookmark => {
        counterMap.set(bookmark.articleId, (counterMap.get(bookmark.articleId) ?? 0) + COUNTER.BOOKMARK);
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
    const {
      body: { user, title, content, group, photos },
      params: { articleId },
    } = req;
    try {
      const article = await ArticleRepository().get(articleId);
      if (article) {
        if (user.profile.id === article.authorId)  {
          article.title = title;
          article.content = content;
          article.group = group;
          article.photos = photos;
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
    } catch(error) {
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
        if (user.profile.id === article.authorId)  {
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
    } catch(error) {
      next(error);
    }
    return res.status(500);
  }
}

export default new ArticleController();
