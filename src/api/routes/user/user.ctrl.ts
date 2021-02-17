import express from 'express';
import UserRepository from '../../../repository/UserRepository';
import { setCookie } from '../../../lib/token';
import Joi from 'joi';

class UserController {

  public get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      params: { code }
    } = req;

    if (!code) {
      return res.json({ ok: false, message: 'user' }); 
    }

    try {
      const user = await UserRepository().getByCode(code.toString())
      return res.json({ ok: true, message: 'user', user }); 
    } catch (error) {
      next(error);
    }
    return res.json({ ok: false, message: 'user' }); 
  }

  public search = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      query,
    } = req;

    try {
      const users = await UserRepository().search(query)
      return res.json({ ok: true, message: 'search', users }); 
    } catch (error) {
      next(error);
    }
    return res.json({ ok: false, message: 'search' }); 
  }

  public updateUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      body,
    } = req;
    try {
      const modificationData = { ...body };
      delete modificationData.user;
      
      if (!body.user?.profile) {
        next('no profile')
      }
      const validation = validateUserProfile(body);

      if (validation.error) {
        console.error(validation.error);
      } else {
        
        
        const user = await UserRepository().getByCode(body.user?.profile.code);
        if (user) {
          user.name = modificationData.name;
          user.thumbnail = modificationData.profileImage;
          user.profileImage = modificationData.profileImage;
          user.group = modificationData.group;
          user.description = modificationData.description;
          await UserRepository().save(user);
          const token = await user.generateToken;
          setCookie(req, res, token);
        }
      }
      return res.json({ ok: true, message: `user updated`, modificationData });
    } catch(error) {
      next(error);
    }
       
    return res.json({ ok: true, message: 'update User' });
  };
}

export default new UserController();

function validateUserProfile(modificationInfo: any) {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(2).max(10),
    profileImage: Joi.string().required(),
    group: Joi.string().required(),
    description: Joi.string().required().allow(''),
    user: Joi.object().required(),
  });
  return schema.validate(modificationInfo);
}