import { wLogger } from './../../shared/logger';
import { ConfigDao } from './../../daos/config-dao/config.dao';
import { Config } from './../../models/config.model';
import { IResponse } from './../../models/response.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

// Init shared
const singular = Router();
const plural = Router();
const configDao = new ConfigDao();
export const paramMissingError = 'One or more of the required parameters was missing.';

// Init routes
export const getConfigsPath = ''; // raíz
export const getConfigPath = '/:id';
export const addConfigPath = '';
export const updateConfigPath = '/:id';
export const deleteConfigPath = '/:id';

export const defaultConfig = new Config({
  top: false,
  size: 2.5,
  pad: 1,
});

/******************************************************************************
 *                      Get All Configs - 'GET /api/configs'
 ******************************************************************************/
plural.get(getConfigsPath, async (req: Request, res: Response) => {
  try {
    const configs = await configDao.getAll();

    if (!configs.length) {
      configs.push(defaultConfig);
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
});

/******************************************************************************
 *                      Get One Config - 'GET /api/config/{id}'
 ******************************************************************************/
singular.get(getConfigPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const config = await getConfig(id);

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
});

const getConfig = (id: string) => {
  return configDao.get(id);
};

/******************************************************************************
 *                       Add One - 'POST /api/config'
 ******************************************************************************/
export async function insertNewConfig(req: Request, res: Response): Promise<string> {
  try {
    const config = new Config(req.body);

    // valida os parametros requeridos
    if (!validateRecivedConfig(config)) {
      throw { message: paramMissingError };
    }

    // grava e já recebe o id
    const id = await configDao.add(config);

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
singular.post(addConfigPath, async (req: Request, res: Response) => {
  const id = await insertNewConfig(req, res);

  // prepara o responde
  const response: IResponse = { id, success: true };

  return res.status(CREATED).json(response);
});

export function validateRecivedConfig(config: Config): boolean {
  if (!config.pad && config.pad !== 0) {
    return false;
  } else if (!config.size && config.size !== 0) {
    return false;
  } else {
    return true;
  }
}

/******************************************************************************
 *                       Update - 'PUT /api/config/{id}'
 ******************************************************************************/
export async function updateConfig(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id || req.body.id;
    const config = new Config(req.body);

    // valida os parametros requeridos
    if (!validateRecivedConfig(config)) {
      throw { message: paramMissingError };
    }

    // injeta o id
    config.id = id;

    await update(config);

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
singular.put(updateConfigPath, async (req: Request, res: Response) => {
  await updateConfig(req, res);

  // prepara o responde
  const response: IResponse = { success: true };

  // retorna
  return res.status(OK).json(response);
});

const update = (config: Config) => {
  return configDao.update(config);
};

/******************************************************************************
 *                    Delete - 'DELETE /api/config/:id'
 ******************************************************************************/
singular.delete(deleteConfigPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await configDao.delete(id);

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
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/
export const ConfigRoute = {
  singular,
  plural,
  getConfig,
  update,
};
