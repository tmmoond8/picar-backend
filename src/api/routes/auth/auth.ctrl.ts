import express from 'express';
import { getConnection } from 'typeorm';
import User, { createUser } from '../../../entity/User';

class AuthController {
  public signIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'signIn' });
  };

  public check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.json({ ok: true, message: 'check' });
  };

  public signUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    const user = createUser(body);

    await getConnection().getRepository(User).save(user);
    res.json({ ok: true, message: `created: ${user.id}` });
  };
}

export default new AuthController();
