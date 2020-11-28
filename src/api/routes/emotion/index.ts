import { Router } from 'express';
import emotionContoller from './emotion.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/emotion', route);
  route.get('/list/:articleId', emotionContoller.list);
  route.post('/add', emotionContoller.add);
  route.delete('/delete', emotionContoller.delete);
};
