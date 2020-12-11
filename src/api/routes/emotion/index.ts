import { Router } from 'express';
import emotionContoller from './emotion.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/emotion', route);
  route.get('/user/:userCode', emotionContoller.getUserEmotions);
  route.get('/user', emotionContoller.getUserEmotions);
  route.get('/:articleId', emotionContoller.get);
  route.post('/', emotionContoller.cud);
};
