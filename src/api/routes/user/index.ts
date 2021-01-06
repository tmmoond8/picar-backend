import { Router } from 'express';
import UserController from './user.controller';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get('/:code', UserController.get)
  route.get('/search', UserController.search)
  route.put('/modify', UserController.updateUser);
};