import * as winston from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp as string} ${level}: ${message as string}`;
        }),
      ),
      transports: [
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m', // max file size
          maxFiles: '14d', // retain 14 days of logs
        }),
        new winston.transports.Console(), // Optionally log to the console as well
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
