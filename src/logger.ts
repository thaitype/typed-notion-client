import type { LoggerOptions } from 'pino';

import pino from 'pino';

export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
}

export const getPinoLogger = (option?: LoggerOptions) =>
  pino({
    ...option,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    ...(option?.transport ?? {}),
  });

export const consoleLogger: Logger = {
  debug: console.debug,
  info: console.info,
  error: console.error,
  warn: console.warn,
};
