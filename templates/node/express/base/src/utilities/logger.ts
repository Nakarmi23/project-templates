import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';
import lodash from 'lodash';

chalk.level = 3;

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, payload: rawPayload }) => {
    const levelUpper = level.toUpperCase();
    let payload = '';
    switch (levelUpper) {
      case 'INFO':
        level = chalk.blue.bold(level);
        break;

      case 'WARN':
        message = chalk.yellow(message);
        level = chalk.yellow.bold(level);
        break;

      case 'ERROR':
        message = chalk.red(message);
        level = chalk.red.bold(level);
        break;

      case 'DEBUG':
        message = chalk.magentaBright(message);
        level = chalk.magenta.bold(level);
        break;

      default:
        break;
    }

    if (!lodash.isEmpty(rawPayload))
      payload = chalk.gray(
        JSON.stringify(rawPayload, null, 2).replace(/\\n/g, '\n'),
      );

    return `[${chalk.gray(timestamp)}] ${level}: ${
      message as string
    } ${payload}`;
  },
);

const fileFormat = winston.format.printf(
  ({ level, message, timestamp, payload: p }) => {
    let payload = '';
    if (!lodash.isEmpty(p))
      payload = JSON.stringify(p, null, 2).replace(/\\n/g, '\n');

    return `[${timestamp as string}] ${level}: ${message as string} ${payload}`;
  },
);

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    winston.format.splat(),
    consoleFormat,
  ),
  transports: [
    new winston.transports.Console({ level: 'debug' }),
    new winston.transports.DailyRotateFile({
      dirname: path.join(import.meta.dirname, 'logs'),
      maxFiles: '30d',
      datePattern: 'YYYY-MM-DD',
      filename: 'app-%DATE%',
      frequency: 'daily',
      extension: '.log',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        winston.format.splat(),
        fileFormat,
      ),
    }),
  ],
});
