import express from 'express';
import { getConnection } from 'typeorm';
import axios from 'axios';
import Joi from 'joi';
import LruChache from 'lru-cache';
import config from '../../../config';
import UserRepository from '../../../repository/UserRepository';
import User, { createUser } from '../../../entity/User';
import { setCookie, clearCookie } from '../../../lib/token'; ''

const cache = new LruChache<string, any>({
  max: 1000,
  maxAge: 1000 * 60 * 3, // 3분
})

class AuthController {
  public getUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { body } = req;
    if ('user' in body) {
      const user = await UserRepository().getByCode(body.user.profile.code);
      if (user) {
        const token = await user.generateToken;
        setCookie(req, res, token);
        return res.json({ ok: true, message: 'user', data: user.profile });
      }
    }
    return res.json({ ok: false, message: 'guest' });
  };

  public check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { query: { snsId, provider } } = req;
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
    clearCookie(req, res);
    await UserRepository().save(user);
    return res.json({
      ok: true,
      message: 'delete user',
    })
  }

  public getUUID = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { params: { id } } = req;
    const tokens = cache.get(id);
    if (tokens) {
      cache.set(id, null);
      return res.json({ ok: true, message: `found`, tokens });
    } else {
      return res.json({ ok: true, message: `not found`, tokens: null });
    }
  };

  public setUUID = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { params: { id } } = req;
    const { accessToken, refreshToken } = req.body;
    if (id) {
      cache.set(id, { accessToken, refreshToken });
      return res.json({ ok: true, message: `setUUid: ${id}` });
    }
    return res.json({ ok: false, message: `setUUid: ${id}` });
  };


  public getToken = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { code, provider } = req.body;
    if (provider === 'naver') {
      const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.auth.naverClientId}&client_secret=${config.auth.naverClientSecret}&code=${code}&state=naver`;
      const { data } = await axios.get(url, {
        headers: {
          'X-Naver-Client-Id': config.auth.naverClientId,
          'X-Naver-Client-Secret': config.auth.naverClientSecret,
        }
      });
      return res.json({ ok: true, message: "getToken", access_token: data.access_token, refresh_token: data.refresh_token });
    }
    return res.json({ ok: false, message: `getToken: ${code}, ${provider}` });
  };

  // 로그인
  public owwnerLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { email, password } = req.body;
    if (password === config.adminKey) {
      const user = await UserRepository().getByEmail(email);
      if (user && !user.isDelete) {
        const token = await user.generateToken;
        setCookie(req, res, token);
        return res.json({ ok: true, message: `logined`, profile: user.profile });
      }
    }
    return res.json({ ok: false, message: `not found`, data: null });
  }

  // kakao 로그인
  public kakaoLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { accessToken, refreshToken } = req.body;
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const user = await UserRepository().get(data.id.toString(), 'kakao');
    if (user && !user.isDelete) {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await UserRepository().save(user);
      const token = await user.generateToken;
      setCookie(req, res, token);
      return res.json({ ok: true, message: 'user', profile: user.profile, token });
    }
    return res.json({ ok: true, kakaoUser: data });
  }

  // Kakao 회원가입 TODO DEPRECATED
  public kakaoSignUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      body,
    } = req;
    delete body.user;
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

  // 회원가입
  public signUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const {
      body,
    } = req;
    delete body.user;
    const validation = validateLoginProfile(body);
    if (validation.error) {
      return next(validation.error);
    }

    try {
      const user = await getUser(body, body.provider);
      if (user === undefined) {
        throw new Error('');
      }
      const token = await user.generateToken;
      setCookie(req, res, token);
      return res.json({ ok: true, message: 'user', profile: user.profile, token });
    } catch (error) {
      return next(error);
    }
  };


  // naver 로그인
  public naverLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { accessToken, refreshToken } = req.body;
    const { data: { response } } = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const user = await UserRepository().get(response.id.toString(), 'naver');
    if (user && !user.isDelete) {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await UserRepository().save(user);
      const token = await user.generateToken;
      setCookie(req, res, token);
      return res.json({ ok: true, message: 'user', profile: user.profile, token });
    }
    return res.json({ ok: true, naverUser: response });
  }

  public list = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return res.json({ ok: true, message: `list`, list: cache.dump() });
  }
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
    uuid: Joi.string(),
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