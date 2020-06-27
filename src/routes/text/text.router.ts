import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { ConfigRoute } from '../config-router/config.router';
import { TextModel } from '../../models/text.model';
import { Express } from 'express';
import socketIo from 'socket.io';

export class TextRoute {
  private data: TextModel;
  private configRoute: ConfigRoute;
  public route: Router;
  public getTextPath = '/';

  constructor(
    private readonly app: Express,
    private readonly io: socketIo.Server,
  ) {
    // config
    this.configRoute = new ConfigRoute();

    this.route = Router();

    this.data = new TextModel({
      ...this.configRoute.defaultConfig,
      text: '...',
    });

    this.configureGet();
    this.setRoutePost();
  }

  private configureGet(): void {
    this.route.get(this.getTextPath, async (req: Request, res: Response) => {
      return res.status(OK).json(this.data);
    });
  }

  private setRoutePost(): void {
    this.route.post(this.getTextPath, async (req: Request, res: Response) => this.postText(req, res));
  }

  private async postText(req: Request, res: Response): Promise<Response> {
    const received = new TextModel(req.body);

    if (!this.configRoute.validateRecivedConfig(received)) {
      this.data.text = received.text;

      // avisa o socket
      this.io.sockets.emit('data-show', this.data);

      return res.status(OK).json({ id: received.id });
    }

    // atualiza ou insere config
    if (received.id) {
      await this.configRoute.updateConfig(req, res);
    } else {
      received.id = await this.configRoute.insertNewConfig(req, res);
    }

    // se não veio textto aproveita o texto que já tinha
    if (!received.text) {
      received.text = this.data.text;
    }

    // dados atualizados
    this.data = received;

    // avisa o socket
    this.io.sockets.emit('data-show', this.data);

    return res.status(OK).json({ id: received.id });
  }
}
