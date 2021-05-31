import { Router } from 'express';
import newsContoller from './news.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/news', route);
  route.get('/list', newsContoller.list);
};
