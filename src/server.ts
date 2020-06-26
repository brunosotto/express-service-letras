import cookieParser from 'cookie-parser';
import express from 'express';
import socketIo from 'socket.io';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import { BaseRouter } from './routes/base';
import { createServer, Server } from 'http';
import { wLogger } from './shared/logger';
import { SocketEvent } from './constants';
import { Express } from 'express';
import cors from 'cors';

export class AppServer {
    public static readonly PORT: number = 8080;
    public app: Express;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
        this.port = Number(process.env.PORT || 3000);

        this.configureApp();
        this.listen();
    }

    private configureApp(): void {
        // CORS
        this.app.use(cors());
        this.app.options('*', cors());

        // Add middleware/settings/routes to express.
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        // api
        const baseRouter = new BaseRouter(this.app, this.io);
        this.app.use('/api', baseRouter.router);

        // public
        const staticDir = path.join(__dirname, 'public');
        this.app.use(express.static(staticDir));

        // views
        const viewsDir = path.join(__dirname, 'views');
        this.app.set('views', viewsDir);

        // 404
        this.app.get('/*', (req: Request, res: Response) => {
            res.sendFile('404.html', { root: viewsDir });
        });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            wLogger.info('Express server started on port: ' + this.port);
        });

        this.io.on(SocketEvent.CONNECT, (socket: socketIo.Socket) => {
            wLogger.info('Connected client with id: ' + socket.client.id);

            socket.on(SocketEvent.DISCONNECT, () => {
                wLogger.info('Client disconnected: ' + socket.client.id);
            });
        });
    }
}
