import { Router } from 'express';
import articleContoller from './article.ctrl';
import { testMiddleware } from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/article', route);

  route.get('/list/pop', articleContoller.listPopular);
  route.get('/list/:code', articleContoller.listByCode);
  route.get('/list', articleContoller.list);
  route.get('/search', articleContoller.search);
  route.post('/write', articleContoller.write);
  route.put('/update/:articleId', articleContoller.update);
  route.get('/:id', testMiddleware, articleContoller.get);
  route.delete('/remove/:articleId', testMiddleware, articleContoller.remove);
};
