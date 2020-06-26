import { wLogger } from './../../shared/logger';
import { LouvorDao } from './../../daos/louvor/louvor.dao';
import { Louvor } from './../../models/louvor.model';
import { IResponse } from './../../models/response.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

// Init shared
const singular = Router();
const plural = Router();
const louvorDao = new LouvorDao();
export const paramMissingError = 'One or more of the required parameters was missing.';

// Init routes
export const getLouvoresPath = ''; // raíz
export const getLouvorPath = '/:id';
export const addLouvorPath = '';
export const updateLouvorPath = '/:id';
export const deleteLouvorPath = '/:id';

/******************************************************************************
 *                      Get All Louvores - "GET /api/louvores"
 ******************************************************************************/
plural.get(getLouvoresPath, async (req: Request, res: Response) => {
  try {
    const louvores = await louvorDao.getAll();

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

/******************************************************************************
 *                      Get One Louvor - "GET /api/louvor/{id}"
 ******************************************************************************/
singular.get(getLouvorPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const louvor = await getLouvor(id);

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

const getLouvor = (id: string) => {
  return louvorDao.get(id);
};

/******************************************************************************
 *                       Add One - "POST /api/louvor"
 ******************************************************************************/
singular.post(addLouvorPath, async (req: Request, res: Response) => {
  try {
    const louvor = new Louvor(req.body);

    // valida os parametros requeridos
    if (!validateRecivedLouvor(louvor)) {
      throw { message: paramMissingError };
    }

    // grava e já recebe o id
    const id = await louvorDao.add(louvor);

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

function validateRecivedLouvor(louvor: Louvor): boolean {
  if (!louvor.name) {
    return false;
  } else if (!louvor.text) {
    return false;
  } else {
    return true;
  }
}

/******************************************************************************
 *                       Update - "PUT /api/louvor/{id}"
 ******************************************************************************/
singular.put(updateLouvorPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const louvor = new Louvor(req.body);

    // valida os parametros requeridos
    if (!validateRecivedLouvor(louvor)) {
      throw { message: paramMissingError };
    }

    // injeta o id
    louvor.id = id;

    await updateLouvor(louvor);

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

const updateLouvor = (louvor: Louvor) => {
  return louvorDao.update(louvor);
};

/******************************************************************************
 *                    Delete - "DELETE /api/louvor/:id"
 ******************************************************************************/
singular.delete(deleteLouvorPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await louvorDao.delete(id);

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

/******************************************************************************
 *                                     Export
 ******************************************************************************/
export const LouvorRoute = {
  singular,
  plural,
  getLouvor,
  updateLouvor,
};
