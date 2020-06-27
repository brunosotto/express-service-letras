import { wLogger } from './../../shared/logger';
import { ConfigDao } from './../../daos/config-dao/config.dao';
import { Config } from './../../models/config.model';
import { IResponse } from './../../models/response.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

export class ConfigRoute {

  private configDao: ConfigDao;
  public defaultConfig: Config;
  public paramMissingError = 'One or more of the required parameters was missing.';
  public singular: Router;
  public plural: Router;
  public getConfigsPath: string;
  public getConfigPath: string;
  public addConfigPath: string;
  public updateConfigPath: string;
  public deleteConfigPath: string;

  constructor() {
    this.singular = Router();
    this.plural = Router();
    this.configDao = new ConfigDao();

    this.configure();
    this.setPluralGet();
    this.setSingularGet();
    this.setSingularPost();
    this.setSingularPut();
    this.setSingularDelete();
  }

  private configure(): void {
    this.defaultConfig = new Config({
      top: false,
      size: 2.5,
      pad: 1,
    });

    this.getConfigsPath = ''; // raíz
    this.getConfigPath = '/:id';
    this.addConfigPath = '';
    this.updateConfigPath = '/:id';
    this.deleteConfigPath = '/:id';
  }

  private setPluralGet(): void {
    this.plural.get(this.getConfigsPath, async (req: Request, res: Response) => this.listaConfig(req, res));
  }

  private async listaConfig(req: Request, res: Response): Promise<Response> {
    try {
      const configs = await this.configDao.getAll();

      if (!configs.length) {
        configs.push(this.defaultConfig);
      }

      return res.status(OK).json(configs);
    } catch (err) {
      // loga
      wLogger.error(err.message, err);

      // prepara o responde
      const response: IResponse = {
        success: false,
        message: err.message,
        type: 'ErrorListConfigs',
      };

      // retorna
      return res.status(BAD_REQUEST).json(response);
    }
  }

  public async getFirstConfig(): Promise<Config> {
    const lista = await this.configDao.getAll();
    return (lista || [])[0] || this.defaultConfig;
  }

  private setSingularGet(): void {
    this.singular.get(this.getConfigPath, async (req: Request, res: Response) => this.pegaConfig(req, res));
  }

  private async pegaConfig(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const config = await this.getConfig(id);

      return res.status(OK).json(config);
    } catch (err) {
      // loga
      wLogger.error(err.message, err);

      // prepara o responde
      const response: IResponse = {
        success: false,
        message: err.message,
        type: 'ErrorGetConfig',
      };

      // retorna
      return res.status(BAD_REQUEST).json(response);
    }
  }

  private getConfig(id: string): Promise<Config> {
    return this.configDao.get(id);
  }

  public async insertNewConfig(req: Request, res: Response): Promise<string> {
    try {
      const config = new Config(req.body);

      // valida os parametros requeridos
      if (!this.validateRecivedConfig(config)) {
        throw { message: this.paramMissingError };
      }

      // grava e já recebe o id
      const id = await this.configDao.add(config);

      return id;
    } catch (err) {
      // loga
      wLogger.error(err.message, err);

      // prepara o responde
      const response: IResponse = {
        success: false,
        message: err.message,
        type: 'ErrorAddConfig',
      };

      // retorna
      res.status(BAD_REQUEST).json(response);
      return null;
    }
  }

  private setSingularPost(): void {
    this.singular.post(this.addConfigPath, async (req: Request, res: Response) => this.insereConfig(req, res));
  }

  private async insereConfig(req: Request, res: Response): Promise<Response> {
    const id = await this.insertNewConfig(req, res);

    // prepara o responde
    const response: IResponse = { id, success: true };

    return res.status(CREATED).json(response);
  }

  public validateRecivedConfig(config: Config): boolean {
    if (!config.pad && config.pad !== 0) {
      return false;
    } else if (!config.size && config.size !== 0) {
      return false;
    } else {
      return true;
    }
  }

  public async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id || req.body.id;
      const config = new Config(req.body);

      // valida os parametros requeridos
      if (!this.validateRecivedConfig(config)) {
        throw { message: this.paramMissingError };
      }

      // injeta o id
      config.id = id;

      await this.update(config);

      // retorna
      return;
    } catch (err) {
      // loga
      wLogger.error(err.message, err);

      // prepara o responde
      const response: IResponse = {
        success: false,
        message: err.message,
        type: 'ErrorUpdateConfig',
      };

      // retorna
      res.status(BAD_REQUEST).json(response);
      return;
    }
  }

  private setSingularPut(): void {
    this.singular.put(this.updateConfigPath, async (req: Request, res: Response) => this.atualizaConfig(req, res));
  }

  private async atualizaConfig(req: Request, res: Response): Promise<Response> {
    await this.updateConfig(req, res);

    // prepara o responde
    const response: IResponse = { success: true };

    // retorna
    return res.status(OK).json(response);
  }

  private update(config: Config): Promise<void> {
    return this.configDao.update(config);
  }

  private setSingularDelete(): void {
    this.singular.delete(this.deleteConfigPath, async (req: Request, res: Response) => this.excluiConfig(req, res));
  }

  private async excluiConfig(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      await this.configDao.delete(id);

      // prepara o responde
      const response: IResponse = { success: true };

      // retorna
      return res.status(OK).json(response);
    } catch (err) {
      // loga
      wLogger.error(err.message, err);

      // prepara o responde
      const response: IResponse = {
        success: false,
        message: err.message,
        type: 'ErrorDeleteConfig',
      };

      // retorna
      return res.status(BAD_REQUEST).json(response);
    }
  }

}
