import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { defaultConfig, updateConfig, insertNewConfig, validateRecivedConfig } from '../config-router/config.router';
import { TextModel } from '../../models/text.model';
import { Express } from 'express';
import socketIo from 'socket.io';

export class TextRoute {
  private data: TextModel;
  public route: Router;
  public getTextPath = '/';

  constructor(
    private readonly app: Express,
    private readonly io: socketIo.Server,
  ) {
    this.route = Router();

    this.data = new TextModel({
      ...defaultConfig,
      text: '...',
    });

    this.configureGet();
    this.configurePost();
  }

  private configureGet(): void {
    this.route.get(this.getTextPath, async (req: Request, res: Response) => {
      return res.status(OK).json(this.data);
    });
  }

  private configurePost(): void {
    this.route.post(this.getTextPath, async (req: Request, res: Response) => {
      const received = new TextModel(req.body);

      if (!validateRecivedConfig(received)) {
        this.data.text = received.text;

        // avisa o socket
        this.io.sockets.emit('data-show', this.data);

        return res.status(OK).json({ id: received.id });
      }

      // atualiza ou insere config
      if (received.id) {
        await updateConfig(req, res);
      } else {
        received.id = await insertNewConfig(req, res);
      }

      // se não veio textto aproveita o texto que já tinha
      if (!received.text) {
        received.text = this.data.text;
      }

      // dados atualizados
      this.data = received;

      return res.status(OK).json({ id: received.id });
    });
  }
}
