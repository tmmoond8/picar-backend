import express from 'express';
import { getConnection } from 'typeorm';
import User, { createUser } from '../../../entity/User';

class ArticleController {
  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'get' });
  };

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'list' });
  };

  public write = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const user = createUser({
      name: 'kaka',
      email: 'kaka@test.com',
      provider: 'google',
      snsId: '3939732',
    });
    await getConnection().getRepository(User).save(user);
    res.json({ ok: true, message: 'write' });
  };
}

export default new ArticleController();
