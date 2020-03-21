import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes/base';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// api
app.use('/api', BaseRouter);

// public
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// views
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// 404
app.get('/*', (req: Request, res: Response) => {
    res.sendFile('404.html', {root: viewsDir});
});

// Export express instance
export default app;
