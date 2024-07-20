import express from 'express';
import helmet from 'helmet';
import { appConfig } from './config/config';
import { appRouter } from './app-router';
import compression from 'compression';
import { logger } from './utilities/logger';
import { appEndpointLogger } from './middleware/app-endpoint-logger';

const bootstrap = () => {
  const app = express();

  const port = appConfig.application.port || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security headers
  app.use(helmet());

  // Reducing fingerprinting
  app.disable('x-powered-by');

  // Compressing responses larger than 2 KB
  app.use(
    compression({
      // Don't compress response under 2 KB
      threshold: 2048,
      filter(req, res) {
        if (req.headers['x-no-compression']) {
          // don't compress responses with this request header
          return false;
        }

        // fallback to standard filter function
        return compression.filter(req, res);
      },
    }),
  );

  app.use(appEndpointLogger);

  logger.info(`Initializing application routes`);
  app.use(appRouter);

  app.listen(port, () => {
    logger.info(`🚀 Application running on port: ${port.toString()}`, {
      test: 'test',
    });
  });
};

bootstrap();
