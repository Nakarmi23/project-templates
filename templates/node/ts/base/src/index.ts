import express from 'express';
import helmet from 'helmet';
import { appConfig } from './config/config';

const bootstrap = async () => {
  const app = express();

  const port = appConfig.application.port || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security headers
  app.use(helmet());

  // Reducing fingerprinting
  app.disable('x-powered-by');

  app.listen(port, () => {
    console.log(`🚀 Application running on port: ${port}`);
  });
};

bootstrap();
