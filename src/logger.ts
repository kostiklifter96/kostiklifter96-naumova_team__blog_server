import winston, { transports } from "winston";

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new transports.File({ filename: "src/logs/example.log" }),
    ],
});
