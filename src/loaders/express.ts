import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import routes from '../api';
import config from '../config';
import { jwtMiddleware } from '../lib/token';

interface OwnerError extends Error {
  status?: number;
}

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());

  app.use(morgan('common'));

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Middleware req.cookies
  app.use(cookieParser());

  // Midleware that jwt token processing
  app.use(jwtMiddleware);

  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found') as OwnerError;
    err.status = 404;
    next(err);
  });

  /// error handlers
  app.use(
    (
      err: OwnerError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      /**
       * Handle 401 thrown by express-jwt library
       */
      if (err.name === 'UnauthorizedError') {
        return res
          .status(err.status ?? 500)
          .send({ message: err.message })
          .end();
      }
      return next(err);
    },
  );
  app.use(
    (
      err: OwnerError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: err.message,
        },
      });
    },
  );
};
