import pino from "pino";
import pretty from "pino-pretty";

export const logger = pino(
    {level: process.env.APP_LOG_LEVEL || 'info', timestamp: false},
    pretty({translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l'})
);
