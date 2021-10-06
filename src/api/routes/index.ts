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
import report from './report';

export default (app: Router) => {
  [
    test,
    article,
    auth,
    comment,
    emotion,
    bookmark,
    user,
    notification,
    news,
    report,
  ].forEach((route) => route(app));
};
