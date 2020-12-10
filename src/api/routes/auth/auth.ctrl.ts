import express from 'express';
import { getConnection } from 'typeorm';
import Joi from 'joi';
import User, { createUser } from '../../../entity/User';
import { setCookie } from '../../../lib/token';

class AuthController {
  public getUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    if ('user' in body) {
      res.json({ ok: true, message: 'user', data: body.user.profile });
    }
    res.json({ ok: false, message: 'guest' });
  };

  public check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { query: { snsId, provider} } = req;
    let user = await getConnection().getRepository(User).findOne({ where: { snsId, provider } });
    if (user) {
      const token = await user.generateToken;
      setCookie(req, res, token);
      res.json({ ok: true, message: `found`, data: user.profile });
    } else {
      res.json({ ok: true, message: `not found`, data: null });
    }
  };

  // Kakao 로그인
  public kakaoLogin = async (
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

  // Kakao 체크
  public kakaoCheck = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      query,
    } = req;
    return res.json(query);
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
    user = await getConnection().getRepository(User).save(newUser);
  }
  return user;
}