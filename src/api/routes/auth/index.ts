import { Router } from 'express';
import articleContoller from './auth.ctrl';
import { testMiddleware } from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.get('/check', testMiddleware, articleContoller.check);
  route.get('/signIn', articleContoller.signIn);
  route.post('/signUp', articleContoller.signUp);
  route.post('/signIn/kakao', articleContoller.kakaoLogin);
};
