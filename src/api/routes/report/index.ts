import { Router } from 'express';
import reportContoller from './report.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/report', route);
  route.get('/list', reportContoller.list);
  route.post('/add/:articleId', reportContoller.add);
  route.delete('/remove/:articleId', reportContoller.remove);
};
