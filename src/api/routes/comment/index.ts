import { Router } from 'express';
import commentContoller from './comment.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/comment', route);
  route.get('/user/:userCode', commentContoller.getUserComments);
  route.get('/user', commentContoller.getUserComments);
  route.get('/list/:articleId', commentContoller.list);
  route.post('/write', commentContoller.write);
  route.delete('/remove/:commentId', commentContoller.remove);
};
