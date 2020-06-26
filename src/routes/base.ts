import { Request, Response, Router } from 'express';
import { LouvorRoute } from './louvor/louvor.router';
import { ConfigRoute } from './config-router/config.router';
import { TextRoute } from './text/text.router';
import { NOT_FOUND } from 'http-status-codes';
import { Express } from 'express';
import socketIo from 'socket.io';

export class BaseRouter {
  public router: Router;

  constructor(
    private readonly app: Express,
    private readonly io: socketIo.Server,
  ) {
    this.router = Router();
    this.configureRoutes();
    this.configure404();
  }

  private configureRoutes(): void {
    // louvor
    this.router.use('/louvor', LouvorRoute.singular);
    this.router.use('/louvores', LouvorRoute.plural);

    // config
    const configRoute = new ConfigRoute();
    this.router.use('/config', configRoute.singular);
    this.router.use('/configs', configRoute.plural);

    // text
    const textRoute = new TextRoute(this.app, this.io);
    this.router.use('/text', textRoute.route);
  }

  private configure404(): void {
    // 404 default
    this.router.all('/*', (req: Request, res: Response) => {
      return res.status(NOT_FOUND).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found',
      });
    });
  }
}
