import { Router } from 'express';
import articleContoller from './auth.ctrl';
import { testMiddleware } from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.get('/getUser', testMiddleware, articleContoller.getUser);
  route.get('/check', articleContoller.check);
  route.get('/checkUUID', articleContoller.checkUUID);
  route.post('/login/kakao', articleContoller.kakaoLogin);
  route.post('/signUp/kakao', articleContoller.kakaoSignUp);
  route.delete('/delete/:code', articleContoller.delete);
};
