import { Router } from 'express';
import routes from './routes';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  routes(app);

  return app;
};
