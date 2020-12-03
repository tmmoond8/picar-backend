import { Router } from 'express';
import bookmarkContoller from './bookmark.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/bookmark', route);
  route.get('/list', bookmarkContoller.list);
  route.post('/add/:articleId', bookmarkContoller.add);
  route.post('/remove/:articleId', bookmarkContoller.remove);
};
