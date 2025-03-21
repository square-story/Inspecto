import morgan from 'morgan';
import { Request, Response } from 'express';


//Custom Token for request body
morgan.token('body', (req: Request) => JSON.stringify(req.body));

const logFormat = ':method :url :status :response-time ms - :res[content-length] :body';

export const developmentLogger = morgan(logFormat, {
    skip: (req: Request, res: Response) => res.statusCode >= 400,
    // Green color for success responses
    stream: {
        write: (message: string) => console.log('\x1b[32m', message.trim(), '\x1b[0m'),
    },
})

export const errorLogger = morgan(logFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    // Red color for error responses
    stream: {
        write: (message: string) => console.error('\x1b[31m', message.trim(), '\x1b[0m'),
    },
});