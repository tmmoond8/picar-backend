import { Router } from 'express';
import test from './test';
import auth from './auth';

export default (app: Router) => {
  test(app);
  auth(app);
};
