import { Router } from 'express';
import TestrController from './test.controller';
import { testMiddleware } from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/test', route);

  route.get('/', testMiddleware, TestrController.getTest);
  route.post('/', TestrController.postTest);
  route.post('/log', TestrController.log);
};
