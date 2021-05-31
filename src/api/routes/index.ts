import { Router } from 'express';
import test from './test';
import article from './article';
import comment from './comment';
import auth from './auth';
import emotion from './emotion';
import bookmark from './bookmark';
import user from './user';
import notification from './notification';
import news from './news';

export default (app: Router) => {
  test(app);
  article(app);
  auth(app);
  comment(app);
  emotion(app);
  bookmark(app);
  user(app);
  notification(app);
  news(app);
};
