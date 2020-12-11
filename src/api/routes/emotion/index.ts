import { Router } from 'express';
import emotionContoller from './emotion.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/emotion', route);
  route.get('/list', emotionContoller.list);
  route.get('/:articleId', emotionContoller.get);
  route.get('/list/:userCode', emotionContoller.list);
  route.post('/', emotionContoller.cud);
};
