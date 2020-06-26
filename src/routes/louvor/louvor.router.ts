import { wLogger } from './../../shared/logger';
import { LouvorDao } from './../../daos/louvor/louvor.dao';
import { Louvor } from './../../models/louvor.model';
import { IResponse } from './../../models/response.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

export class LouvorRoute {

  private louvorDao: LouvorDao;
  public paramMissingError = 'One or more of the required parameters was missing.';
  public singular: Router;
  public plural: Router;
  public getLouvoresPath: string;
  public getLouvorPath: string;
  public addLouvorPath: string;
  public updateLouvorPath: string;
  public deleteLouvorPath: string;

  constructor() {
    this.singular = Router();
    this.plural = Router();
    this.louvorDao = new LouvorDao();

    this.configure();
    this.setPluralGet();
    this.setSingularGet();
    this.setSingularPost();
    this.setSingularPut();
    this.setSingularDelete();
  }

  private configure(): void {
    this.getLouvoresPath = ''; // raíz
    this.getLouvorPath = '/:id';
    this.addLouvorPath = '';
    this.updateLouvorPath = '/:id';
    this.deleteLouvorPath = '/:id';
  }

  private setPluralGet(): void {
    this.plural.get(this.getLouvoresPath, async (req: Request, res: Response) => {
      try {
        const louvores = await this.louvorDao.getAll();

        return res.status(OK).json(louvores);
      } catch (err) {
        // loga
        wLogger.error(err.message, err);

        // prepara o responde
        const response: IResponse = { success: false, message: err.message, type: 'ErrorListLouvores' };

        // retorna
        return res.status(BAD_REQUEST).json(response);
      }
    });
  }

  private setSingularGet(): void {
    this.singular.get(this.getLouvorPath, async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const louvor = await this.getLouvor(id);

        return res.status(OK).json(louvor);
      } catch (err) {
        // loga
        wLogger.error(err.message, err);

        // prepara o responde
        const response: IResponse = { success: false, message: err.message, type: 'ErrorGetLouvor' };

        // retorna
        return res.status(BAD_REQUEST).json(response);
      }
    });
  }

  private getLouvor(id: string): Promise<Louvor> {
    return this.louvorDao.get(id);
  }

  private setSingularPost(): void {
    this.singular.post(this.addLouvorPath, async (req: Request, res: Response) => {
      try {
        const louvor = new Louvor(req.body);

        // valida os parametros requeridos
        if (!this.validateRecivedLouvor(louvor)) {
          throw { message: this.paramMissingError };
        }

        // grava e já recebe o id
        const id = await this.louvorDao.add(louvor);

        // prepara o responde
        const response: IResponse = { id, success: true };

        return res.status(CREATED).json(response);
      } catch (err) {
        // loga
        wLogger.error(err.message, err);

        // prepara o responde
        const response: IResponse = { success: false, message: err.message, type: 'ErrorAddLouvor' };

        // retorna
        return res.status(BAD_REQUEST).json(response);
      }
    });
  }

  private validateRecivedLouvor(louvor: Louvor): boolean {
    if (!louvor.name) {
      return false;
    } else if (!louvor.text) {
      return false;
    } else {
      return true;
    }
  }

  private setSingularPut(): void {
    this.singular.put(this.updateLouvorPath, async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        const louvor = new Louvor(req.body);

        // valida os parametros requeridos
        if (!this.validateRecivedLouvor(louvor)) {
          throw { message: this.paramMissingError };
        }

        // injeta o id
        louvor.id = id;

        await this.updateLouvor(louvor);

        // prepara o responde
        const response: IResponse = { success: true };

        // retorna
        return res.status(OK).json(response);
      } catch (err) {
        // loga
        wLogger.error(err.message, err);

        // prepara o responde
        const response: IResponse = { success: false, message: err.message, type: 'ErrorUpdateLouvor' };

        // retorna
        return res.status(BAD_REQUEST).json(response);
      }
    });
  }

  private updateLouvor(louvor: Louvor): Promise<void> {
    return this.louvorDao.update(louvor);
  }

  private setSingularDelete(): void {
    this.singular.delete(this.deleteLouvorPath, async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        await this.louvorDao.delete(id);

        // prepara o responde
        const response: IResponse = { success: true };

        // retorna
        return res.status(OK).json(response);
      } catch (err) {
        // loga
        wLogger.error(err.message, err);

        // prepara o responde
        const response: IResponse = { success: false, message: err.message, type: 'ErrorDeleteLouvor' };

        // retorna
        return res.status(BAD_REQUEST).json(response);
      }
    });
  }

}
