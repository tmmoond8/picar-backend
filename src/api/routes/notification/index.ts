import { Router } from 'express';
import notificationColtroller from './notification.ctrl';

const route = Router();

export default (app: Router) => {
  app.use('/notification', route);
  route.get('/list', notificationColtroller.list);
  route.patch('/checkViews', notificationColtroller.checkViews);
};
