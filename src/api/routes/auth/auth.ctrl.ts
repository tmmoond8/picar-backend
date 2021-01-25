import express from 'express';
import { getConnection } from 'typeorm';
import axios from 'axios';
import Joi from 'joi';
import LruChache from 'lru-cache';
import UserRepository from '../../../repository/UserRepository';
import User, { createUser } from '../../../entity/User';
import { setCookie, clearCookie } from '../../../lib/token';''

const cache = new LruChache<string, any>({
  max: 1000,
  maxAge: 1000 * 60 * 60 * 3,
})

class AuthController {
  public getUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    if ('user' in body) {
      return res.json({ ok: true, message: 'user', data: body.user.profile });
    }
    return res.json({ ok: false, message: 'guest' });
  };

  public check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { query: { snsId, provider} } = req;
    let user = await UserRepository().get(snsId as string, provider as string);
    if (user) {
      const token = await user.generateToken;
      setCookie(req, res, token);
      return res.json({ ok: true, message: `found`, data: user.profile });
    } else {
      return res.json({ ok: true, message: `not found`, data: null });
    }
  };

  public logout = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    if (body.user) {
      clearCookie(req, res);
      return res.json({ ok: true, message: `found` });
    } else {
      return res.json({ ok: false, message: `not found` });
    }
  };


  public delete = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { params: { code } } = req;
    const user = await UserRepository().getByCode(code);
    if (!user) {
      return res.json({
        ok: false,
        message: 'not found',
      })
    }
    user.isDelete = false;
    user.snsId = `DELETE_${user.snsId}`
    setCookie(req, res, '');
    await UserRepository().save(user);
    return res.json({
      ok: true,
      message: 'delete user',
    })
  }

  public checkUUID = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { query: { uuid } } = req;
    const user = cache.get(uuid?.toString() ?? '');
    if (user) {
      const token = await user.generateToken;
      setCookie(req, res, token);
      cache.set(uuid?.toString() ?? '', null);
      return res.json({ ok: true, message: `found`, data: user.profile });
    } else {
      return res.json({ ok: true, message: `not found`, data: null });
    }
  };

  // kakao 로그인
  public kakaoLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { accessToken, refreshToken, uuid } = req.body;
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const user = await UserRepository().get(data.id.toString(), 'kakao');
    console.log(user);
    if (user && !user.isDelete) {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await UserRepository().save(user);
      const token = await user.generateToken;
      setCookie(req, res, token);
      cache.set(uuid, user);
      return res.json(user.profile);
    }
    return res.json(data);
  }

  // Kakao 회원가입
  public kakaoSignUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      body,
    } = req;
    const validation = validateLoginProfile(body);
    if (validation.error) {
      return next(validation.error);
    }
    
    try {
      const user = await getUser(body, 'kakao');
      if (user === undefined) {
        throw new Error('');
      }
      const token = await user.generateToken;
      setCookie(req, res, token);
      return res.json(user.profile);
    } catch (error) {
      return next(error);
    }
  };
}

export default new AuthController();


/**
   * 사용자의 로그인 데이터를 검증
   * @param profile
   */
function validateLoginProfile(profile: any) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    group: Joi.string().required(),
    isOwner: Joi.boolean().required(),
    name: Joi.string().required(),
    profileImage: Joi.string(),
    provider: Joi.string(),
    snsId: Joi.string().required(),
    thumbnail: Joi.string(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
    uuid: Joi.string().required(),
  });
  return schema.validate(profile);
}

/**
 * 유저 정보를 가져온다. 없으면 생성 한다.
 * @param profile
 * @param provider
 */
async function getUser(
  profile: {
    email: string;
    snsId: string;
    thumbnail: string;
    profileImage: string;
    name: string;
    group: string;
    accessToken: string;
    refreshToken: string;
  },
  provider: 'kakao' | 'naver'
) {
  const { email, snsId, thumbnail, name, group, profileImage } = profile;
  let user = await getConnection().getRepository(User).findOne({ where: { snsId, provider } });
  if (!user) {
    const newUser = createUser({
      email,
      provider,
      snsId,
      thumbnail,
      profileImage,
      name,
      group,
    });
    newUser.accessToken = profile.accessToken;
    newUser.refreshToken = profile.refreshToken;

    user = await getConnection().getRepository(User).save(newUser);
  }
  return user;
}