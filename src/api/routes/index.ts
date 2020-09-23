import { Router } from 'express';
import test from './test';

export default (app: Router) => {
  test(app);
};
