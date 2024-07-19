import express from 'express';
import helmet from 'helmet';
import { appConfig } from './config/config';
import { appRouter } from './app-router';
import compression from 'compression';

const bootstrap = async () => {
  const app = express();

  const port = appConfig.application.port || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security headers
  app.use(helmet());

  // Reducing fingerprinting
  app.disable('x-powered-by');

  app.use(
    compression({
      filter(req, res) {
        if (req.headers['x-no-compression']) {
          // don't compress responses with this request header
          return false;
        }

        // fallback to standard filter function
        return compression.filter(req, res);
      },
    })
  );

  app.use(appRouter);

  app.listen(port, () => {
    console.log(`🚀 Application running on port: ${port}`);
  });
};

bootstrap();
