import { Router } from 'express';
import authContoller from './auth.ctrl';
import { testMiddleware } from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);
  route.get('/logout', authContoller.logout);
  route.get('/getUser', testMiddleware, authContoller.getUser);
  route.get('/check', authContoller.check);
  route.get('/uuid/list', authContoller.list)
  route.post('/uuid/:id', authContoller.setUUID);
  route.get('/uuid/:id', authContoller.getUUID);
  route.post('/login/kakao', authContoller.kakaoLogin);
  route.post('/login/naver', authContoller.naverLogin);
  route.post('/login/owwner', authContoller.owwnerLogin);
  route.get('/list/owwner', authContoller.owwnerList);
  route.post('/token', authContoller.getToken);
  route.post('/signUp/kakao', authContoller.kakaoSignUp);
  route.post('/signUp', authContoller.signUp);
  route.delete('/delete/:code', authContoller.delete);
};
