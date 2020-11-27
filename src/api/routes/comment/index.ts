import { Router } from 'express';
import commentContoller from './comment.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/comment', route);
  route.get('/list/:articleId', commentContoller.list);
  route.post('/write', commentContoller.write);
  route.get('/count', commentContoller.count);
};
