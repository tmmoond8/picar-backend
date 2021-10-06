import express from 'express';
import ReportRepository from '../../../repository/ReportRepository';
import { createReport } from '../../../entity/Report';

class ReportController {
  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      body: { user },
    } = req;
    try {
      const reports = await ReportRepository().list(user.profile.code);
      return res.json({
        ok: true,
        message: 'list',
        reports,
      });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
  public add = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const {
      params: { articleId },
      body: { user, commentId, content },
    } = req;
    try {
      const existed = await ReportRepository().get(
        user.profile.code,
        articleId,
        commentId,
      );
      if (existed) {
        res.json({ ok: true, message: 'already existed' });
      } else {
        const report = createReport({
          articleId: parseInt(articleId),
          reporterCode: user.profile.code,
          commentId,
          content,
        });
        await ReportRepository().add(report);
        return res.json({ ok: true, message: 'add', report });
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
      params: { articleId },
      query: { commentId },
      body: { user },
    } = req;
    try {
      await ReportRepository().remove(
        parseInt(articleId),
        user.profile.code,
        commentId as string,
      );
      return res.json({ ok: true, message: 'removed' });
    } catch (error) {
      next(error);
    }
    return res.status(500);
  };
}

export default new ReportController();
