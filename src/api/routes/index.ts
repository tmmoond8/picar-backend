import { Router } from 'express';
import test from './test';
import article from './article';
import comment from './comment';
import auth from './auth';
import emotion from './emotion';
import bookmark from './bookmark';
import user from './user';

export default (app: Router) => {
  test(app);
  article(app);
  auth(app);
  comment(app);
  emotion(app);
  bookmark(app);
  user(app);
};
